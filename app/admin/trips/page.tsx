import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Trip } from '@/lib/types'
import TripManagement from '@/components/TripManagement'
import { Map } from 'lucide-react'

async function getTrips(supabase: any): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) throw error
  return data || []
}

export default async function TripsPage() {
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

  const trips = await getTrips(supabase)

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink flex items-center gap-3">
              <Map className="w-8 h-8 text-rust" />
              Trip Management
            </h1>
            <p className="text-ink/70">Create and manage trips</p>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 bg-white border border-sand/35 hover:border-rust/40 rounded-lg hover:bg-cream/35 text-xs font-semibold tracking-wider uppercase font-sans transition-all"
          >
            Back to Leads
          </a>
        </header>

        <TripManagement trips={trips} userRole={userProfile?.role || 'agent'} />
      </div>
    </div>
  )
}
