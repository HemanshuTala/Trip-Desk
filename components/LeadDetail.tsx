'use client'

import { useState } from 'react'
import { Lead, CallLog, UserProfile, LeadStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase'
import LeadInfoCard from '@/components/lead/LeadInfoCard'
import TouchpointsLog from '@/components/lead/TouchpointsLog'
import PipelineStepper from '@/components/lead/PipelineStepper'
import OwnerPanel from '@/components/lead/OwnerPanel'
import AiAssistantPanel from '@/components/lead/AiAssistantPanel'

interface LeadDetailProps {
  lead: Lead
  callLogs: CallLog[]
  users: UserProfile[]
  currentUserRole?: 'admin' | 'agent'
  currentUserId?: string
}

const PIPELINE_STAGES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE_CHECK_SENT',
  'CONFIRMED',
  'NOT_A_FIT',
]

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-cream text-ink border border-sand/40',
  CONTACTED: 'bg-sand/20 text-ink border border-sand/40',
  QUALIFIED: 'bg-olive text-cream',
  VIBE_CHECK_SENT: 'bg-olive/75 text-sand border border-olive/35',
  CONFIRMED: 'bg-rust text-cream',
  NOT_A_FIT: 'bg-ink text-sand/85',
}

export default function LeadDetail({
  lead,
  callLogs: initialCallLogs,
  users,
  currentUserRole = 'agent',
  currentUserId,
}: LeadDetailProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const [leadData, setLeadData] = useState(lead)

  const isAgent = currentUserRole === 'agent'
  const isOwner = leadData.owner_id === currentUserId
  const isUnassigned = !leadData.owner_id
  const canModify = currentUserRole === 'admin' || (isAgent && (isOwner || isUnassigned))

  const [callLogs, setCallLogs] = useState(initialCallLogs)
  const [newNote, setNewNote] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
  const [showAiMessage, setShowAiMessage] = useState(false)

  // AI Vibe Check States
  const [vibeRating, setVibeRating] = useState<'Fit' | 'Neutral' | 'Requires Call' | null>(null)
  const [vibeReason, setVibeReason] = useState('')
  const [isVibeChecking, setIsVibeChecking] = useState(false)

  // AI Log Summarizer States
  const [logSummary, setLogSummary] = useState('')
  const [isSummarizingLogs, setIsSummarizingLogs] = useState(false)

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setIsUpdatingStatus(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadData.id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('You do not have permission to update this lead status.')
      }

      setLeadData({ ...leadData, status: newStatus })
      router.refresh()
    } catch (error: any) {
      console.error('Error updating status:', error)
      alert(error.message || 'Failed to update status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleOwnerChange = async (ownerId: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ owner_id: ownerId || null })
        .eq('id', leadData.id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('You do not have permission to change this lead owner.')
      }

      setLeadData({ ...leadData, owner_id: ownerId || undefined })
      router.refresh()
    } catch (error: any) {
      console.error('Error updating owner:', error)
      alert(error.message || 'Failed to update owner')
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setIsAddingNote(true)
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .insert({
          lead_id: leadData.id,
          notes: newNote,
          next_action: nextAction || null,
        })
        .select()
        .single()

      if (error) throw error

      setCallLogs([data, ...callLogs])
      setNewNote('')
      setNextAction('')
      router.refresh()
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Failed to add note')
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleGenerateAiMessage = async () => {
    setIsGeneratingMessage(true)
    try {
      const response = await fetch('/api/ai/draft-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadName: leadData.name,
          tripName: leadData.trip?.name,
          tripDestination: leadData.trip?.destination,
          vibeDescription: leadData.vibe_description,
          groupType: leadData.group_type,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setAiMessage(data.message)
      setShowAiMessage(true)
    } catch (error) {
      console.error('Error generating AI message:', error)
      alert('Failed to generate message. Please check your OpenAI API key.')
    } finally {
      setIsGeneratingMessage(false)
    }
  }

  const handleUseAiMessage = () => {
    setNewNote(aiMessage)
    setShowAiMessage(false)
    setAiMessage('')
  }

  const handleVibeCheck = async () => {
    setIsVibeChecking(true)
    try {
      const response = await fetch('/api/ai/vibe-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vibeDescription: leadData.vibe_description,
          groupType: leadData.group_type,
          preferredMonth: leadData.preferred_month,
          tripName: leadData.trip?.name,
          tripDestination: leadData.trip?.destination,
        }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setVibeRating(data.rating)
      setVibeReason(data.reason)
    } catch (error) {
      console.error('Error running vibe check:', error)
      alert('Failed to run vibe check. Please try again.')
    } finally {
      setIsVibeChecking(false)
    }
  }

  const handleSummarizeLogs = async () => {
    if (callLogs.length === 0) return
    setIsSummarizingLogs(true)
    try {
      const response = await fetch('/api/ai/summarize-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: callLogs }),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setLogSummary(data.summary)
    } catch (error) {
      console.error('Error summarizing logs:', error)
      alert('Failed to summarize touchpoint history.')
    } finally {
      setIsSummarizingLogs(false)
    }
  }

  const getCurrentStageIndex = () => {
    return PIPELINE_STAGES.indexOf(leadData.status)
  }

  return (
    <div>
      <div className="mb-6">
        <a
          href="/admin"
          className="text-xs uppercase tracking-widest font-bold text-ink/60 hover:text-rust transition-colors font-sans flex items-center gap-1"
        >
          ← Back to Leads
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LeadInfoCard
            leadData={leadData}
            vibeRating={vibeRating}
            vibeReason={vibeReason}
            isVibeChecking={isVibeChecking}
            canModify={canModify}
            STATUS_COLORS={STATUS_COLORS}
            handleVibeCheck={handleVibeCheck}
          />

          <TouchpointsLog
            callLogs={callLogs}
            newNote={newNote}
            nextAction={nextAction}
            isAddingNote={isAddingNote}
            isSummarizingLogs={isSummarizingLogs}
            logSummary={logSummary}
            canModify={canModify}
            users={users}
            setNewNote={setNewNote}
            setNextAction={setNextAction}
            handleAddNote={handleAddNote}
            handleSummarizeLogs={handleSummarizeLogs}
          />
        </div>

        <div className="space-y-6">
          <PipelineStepper
            leadData={leadData}
            isUpdatingStatus={isUpdatingStatus}
            canModify={canModify}
            handleStatusChange={handleStatusChange}
            PIPELINE_STAGES={PIPELINE_STAGES}
            getCurrentStageIndex={getCurrentStageIndex}
          />

          <OwnerPanel
            leadData={leadData}
            currentUserRole={currentUserRole}
            isOwner={isOwner}
            isUnassigned={isUnassigned}
            currentUserId={currentUserId}
            users={users}
            handleOwnerChange={handleOwnerChange}
          />

          <AiAssistantPanel
            aiMessage={aiMessage}
            isGeneratingMessage={isGeneratingMessage}
            showAiMessage={showAiMessage}
            canModify={canModify}
            handleGenerateAiMessage={handleGenerateAiMessage}
            handleUseAiMessage={handleUseAiMessage}
            setShowAiMessage={setShowAiMessage}
            setAiMessage={setAiMessage}
          />
        </div>
      </div>
    </div>
  )
}
