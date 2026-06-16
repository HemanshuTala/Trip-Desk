import { supabase } from '@/lib/supabase'
import { Lead, CallLog, UserProfile } from '@/lib/types'
import LeadDetail from '@/components/LeadDetail'

async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, trip:trips(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

async function getCallLogs(leadId: string): Promise<CallLog[]> {
  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

async function getUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')

  if (error) throw error
  return data || []
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)
  const callLogs = await getCallLogs(id)
  const users = await getUsers()

  if (!lead) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-ink mb-4">Lead Not Found</h1>
            <a href="/admin" className="text-rust hover:underline">
              Return to Lead List
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <LeadDetail lead={lead} callLogs={callLogs} users={users} />
      </div>
    </div>
  )
}
