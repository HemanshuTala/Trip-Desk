import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Lead, CallLog, UserProfile } from '@/lib/types'
import LeadDetail from '@/components/LeadDetail'

async function getLead(supabase: any, id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, trip:trips(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

async function getCallLogs(supabase: any, leadId: string): Promise<CallLog[]> {
  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

async function getUsers(supabase: any): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')

  if (error) throw error
  return data || []
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  
  if (!isValidUuid) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-display font-bold text-ink mb-4">Lead Not Found</h1>
            <a href="/admin" className="text-rust hover:underline">
              Return to Lead List
            </a>
          </div>
        </div>
      </div>
    )
  }

  const cookieStore = await cookies()
  const supabase = getSupabaseServer(cookieStore)

  let user = null
  let userProfile = null
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user = currentUser
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      userProfile = profile
    }
  } catch (error) {
    console.warn('Could not get current user or profile:', error)
  }
  
  const lead = await getLead(supabase, id)
  const callLogs = await getCallLogs(supabase, id)
  const users = await getUsers(supabase)

  if (!lead) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-display font-bold text-ink mb-4">Lead Not Found</h1>
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
        <LeadDetail
          lead={lead}
          callLogs={callLogs}
          users={users}
          currentUserRole={userProfile?.role || 'agent'}
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
