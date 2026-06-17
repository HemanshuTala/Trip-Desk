import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Lead, Trip } from '@/lib/types'
import LeadList from '@/components/LeadList'
import { Users, LayoutDashboard, Map } from 'lucide-react'

async function getLeads(
  supabase: any,
  page: number,
  search: string,
  status: string,
  tripId: string,
  ownerId: string,
  currentUserId?: string
): Promise<{ leads: Lead[]; total: number }> {
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    let query = supabase
      .from('leads')
      .select('*, trip:trips(*)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      const escaped = search.replace(/"/g, '\\"').replace(/,/g, '\\,')
      query = query.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`)
    }

    if (status && status !== 'ALL') {
      query = query.eq('status', status)
    }

    if (tripId && tripId !== 'ALL') {
      query = query.eq('trip_id', tripId)
    }

    if (ownerId && ownerId !== 'ALL') {
      if (ownerId === 'MINE') {
        if (currentUserId) {
          query = query.eq('owner_id', currentUserId)
        }
      } else if (ownerId === 'UNASSIGNED') {
        query = query.is('owner_id', null)
      } else {
        query = query.eq('owner_id', ownerId)
      }
    }

    const { data, count, error } = await query.range(from, to)

    if (error) throw error
    return {
      leads: (data || []) as Lead[],
      total: count || 0,
    }
  } catch (error) {
    console.error('Error fetching leads:', error)
    return { leads: [], total: 0 }
  }
}

async function getTrips(supabase: any): Promise<Trip[]> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching trips:', error)
    return []
  }
}

async function getStatusCounts(supabase: any): Promise<Record<string, number>> {
  const defaultCounts: Record<string, number> = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    VIBE_CHECK_SENT: 0,
    CONFIRMED: 0,
    NOT_A_FIT: 0,
  }

  try {
    const { data, error } = await supabase.rpc('get_lead_stats')
    if (!error && data) {
      data.forEach((item: { status: string; count: number }) => {
        defaultCounts[item.status] = Number(item.count)
      })
      return defaultCounts
    }
  } catch (err) {
    console.warn('RPC get_lead_stats failed, falling back to parallel selects:', err)
  }

  try {
    const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'VIBE_CHECK_SENT', 'CONFIRMED', 'NOT_A_FIT']
    const counts = await Promise.all(
      statuses.map(async (status) => {
        const { count, error } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', status)
        if (error) throw error
        return { status, count: count || 0 }
      })
    )
    counts.forEach((item) => {
      defaultCounts[item.status] = item.count
    })
  } catch (err) {
    console.error('Failed to fetch fallback status counts:', err)
  }

  return defaultCounts
}

async function getMineCount(supabase: any, userId?: string): Promise<number> {
  if (!userId) return 0
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId)
    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error fetching mine count:', error)
    return 0
  }
}

interface SearchParams {
  page?: string
  search?: string
  status?: string
  trip?: string
  owner?: string
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
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

  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const searchQuery = params.search || ''
  const statusFilter = params.status || 'ALL'
  const tripFilter = params.trip || 'ALL'
  const ownerFilter = params.owner || 'ALL'

  const { leads, total } = await getLeads(
    supabase,
    currentPage,
    searchQuery,
    statusFilter,
    tripFilter,
    ownerFilter,
    user?.id
  )

  const trips = await getTrips(supabase)
  const statusCounts = await getStatusCounts(supabase)
  const mineCount = await getMineCount(supabase, user?.id)

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink flex items-center gap-3">
              <Users className="w-8 h-8 text-rust" />
              Lead Management
            </h1>
            <p className="text-ink/70">Manage and track traveller enquiries</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/admin/trips"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Map className="w-4 h-4 text-olive" />
              Manage Trips
            </a>
            <a
              href="/admin/dashboard"
              className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust/90 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
          </div>
        </header>

        <LeadList
          leads={leads}
          trips={trips}
          currentUserId={user?.id}
          userRole={userProfile?.role || 'agent'}
          totalLeads={total}
          currentPage={currentPage}
          statusCounts={statusCounts}
          mineCount={mineCount}
          initialSearch={searchQuery}
          initialStatus={statusFilter}
          initialTrip={tripFilter}
          initialOwner={ownerFilter}
        />
      </div>
    </div>
  )
}
