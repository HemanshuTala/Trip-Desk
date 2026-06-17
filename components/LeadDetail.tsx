'use client'

import { useState } from 'react'
import { Lead, CallLog, UserProfile, LeadStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase'
import { Phone, Mail, Calendar, Users, Clock, MessageSquare, Sparkles, ArrowRight, Map } from 'lucide-react'

interface LeadDetailProps {
  lead: Lead
  callLogs: CallLog[]
  users: UserProfile[]
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
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  VIBE_CHECK_SENT: 'bg-purple-100 text-purple-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  NOT_A_FIT: 'bg-red-100 text-red-800',
}

export default function LeadDetail({ lead, callLogs: initialCallLogs, users }: LeadDetailProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const [leadData, setLeadData] = useState(lead)
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
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadData.id)

      if (error) throw error

      setLeadData({ ...leadData, status: newStatus })
      router.refresh()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleOwnerChange = async (ownerId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ owner_id: ownerId || null })
        .eq('id', leadData.id)

      if (error) throw error

      setLeadData({ ...leadData, owner_id: ownerId || undefined })
      router.refresh()
    } catch (error) {
      console.error('Error updating owner:', error)
      alert('Failed to update owner')
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
          className="text-ink/70 hover:text-rust transition-colors"
        >
          ← Back to Leads
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-ink mb-2">{leadData.name}</h1>
                <div className="space-y-1 text-sm text-ink/70">
                  <p>{leadData.email}</p>
                  <p>{leadData.phone}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[leadData.status]}`}>
                {leadData.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
              <div>
                <h3 className="text-sm font-medium text-ink/70 mb-1">Trip</h3>
                <p className="text-ink font-medium">{leadData.trip?.name || 'Unknown'}</p>
                <p className="text-sm text-ink/70">{leadData.trip?.destination}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink/70 mb-1">Group Type</h3>
                <p className="text-ink font-medium capitalize">{leadData.group_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink/70 mb-1">Preferred Month</h3>
                <p className="text-ink font-medium">{leadData.preferred_month}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink/70 mb-1">Created</h3>
                <p className="text-ink font-medium">
                  {new Date(leadData.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium text-ink/70 mb-2">What they are hoping for</h3>
              <p className="text-ink mb-4">{leadData.vibe_description}</p>
            </div>

            <div className="pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-ink/70">AI Vibe Fit Suggestion</h3>
                {!vibeRating && (
                  <button
                    onClick={handleVibeCheck}
                    disabled={isVibeChecking}
                    className="px-3 py-1 bg-olive/10 hover:bg-olive/20 text-olive text-xs font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isVibeChecking ? 'Analyzing...' : 'Run Vibe Check'}
                  </button>
                )}
              </div>
              
              {vibeRating && (
                <div className="bg-cream rounded-lg p-4 border border-sand">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-ink/50 font-semibold uppercase tracking-wider">Rating:</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      vibeRating === 'Fit'
                        ? 'bg-green-100 text-green-800'
                        : vibeRating === 'Requires Call'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vibeRating}
                    </span>
                  </div>
                  <p className="text-sm text-ink">{vibeReason}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display font-bold text-ink">Activity Timeline</h2>
            </div>

            {callLogs.length > 0 && (
              <div className="mb-6 bg-cream rounded-lg p-4 border border-sand">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-olive" />
                    AI Timeline Summary
                  </span>
                  <button
                    onClick={handleSummarizeLogs}
                    disabled={isSummarizingLogs}
                    className="text-xs text-rust hover:underline font-semibold"
                  >
                    {isSummarizingLogs ? 'Summarizing...' : (logSummary ? 'Regenerate' : 'Generate Summary')}
                  </button>
                </div>
                {logSummary ? (
                  <p className="text-sm text-ink italic">&quot;{logSummary}&quot;</p>
                ) : (
                  <p className="text-xs text-ink/50">Generate a one-sentence summary of the touchpoint history.</p>
                )}
              </div>
            )}

            <form onSubmit={handleAddNote} className="mb-8 p-4 bg-cream rounded-lg border border-sand">
              <h3 className="text-sm font-semibold text-ink mb-3">Add Note</h3>
              <div className="space-y-4">
                <div>
                  <textarea
                    id="note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none resize-none bg-white text-ink"
                    placeholder="What was discussed on the call..."
                  />
                </div>
                <div>
                  <label htmlFor="nextAction" className="block text-xs font-semibold text-ink/75 mb-1">
                    Next Action (optional)
                  </label>
                  <input
                    id="nextAction"
                    type="text"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none bg-white text-ink"
                    placeholder="e.g., Follow up in 3 days"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingNote || !newNote.trim()}
                  className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {isAddingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {callLogs.length === 0 ? (
                <div className="text-center py-4">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-ink/70">No activity yet.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-sand"></div>
                  {callLogs.map((log, index) => (
                    <div key={log.id} className="relative pl-10 pb-6 last:pb-0">
                      <div className="absolute left-2.5 w-3 h-3 bg-rust rounded-full border-2 border-white"></div>
                      <div className="bg-cream rounded-lg p-4 border border-sand">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-ink/70 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.created_at).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {log.created_by && (
                            <span className="text-xs text-ink/50 bg-white px-2 py-1 rounded">
                              {users.find(u => u.id === log.created_by)?.full_name || users.find(u => u.id === log.created_by)?.email || 'Team member'}
                            </span>
                          )}
                        </div>
                        <p className="text-ink mb-2">{log.notes}</p>
                        {log.next_action && (
                          <div className="mt-3 pt-3 border-t border-sand">
                            <p className="text-sm text-ink/70 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              <strong>Next action:</strong> {log.next_action}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-display font-bold text-ink mb-4">Pipeline Stage</h2>
            <div className="space-y-2">
              {PIPELINE_STAGES.map((stage) => {
                const currentIndex = getCurrentStageIndex()
                const stageIndex = PIPELINE_STAGES.indexOf(stage)
                const isActive = stage === leadData.status
                const isPast = stageIndex < currentIndex

                return (
                  <button
                    key={stage}
                    onClick={() => handleStatusChange(stage)}
                    disabled={isUpdatingStatus}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-rust text-white'
                        : isPast
                        ? 'bg-gray-100 text-ink/70'
                        : 'bg-gray-50 text-ink hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stage.replace(/_/g, ' ')}</span>
                      {isActive && (
                        <span className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-display font-bold text-ink mb-4">Assign Owner</h2>
            <select
              value={leadData.owner_id || ''}
              onChange={(e) => handleOwnerChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-display font-bold text-ink mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-olive" />
              AI Assistant
            </h2>
            <p className="text-sm text-ink/70 mb-4">
              Generate a warm WhatsApp message to send to this lead.
            </p>
            <button
              onClick={handleGenerateAiMessage}
              disabled={isGeneratingMessage}
              className="w-full px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingMessage ? 'Generating...' : 'Draft WhatsApp Message'}
            </button>

            {showAiMessage && (
              <div className="mt-4 p-4 bg-cream rounded-lg border border-sand">
                <p className="text-sm text-ink mb-3">{aiMessage}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUseAiMessage}
                    className="px-3 py-1 bg-rust text-white text-sm rounded-lg hover:bg-rust/90 transition-colors"
                  >
                    Use This Message
                  </button>
                  <button
                    onClick={() => {
                      setShowAiMessage(false)
                      setAiMessage('')
                    }}
                    className="px-3 py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
