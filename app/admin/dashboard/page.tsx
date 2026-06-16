import { supabase } from '@/lib/supabase'
import { Lead, Trip, LeadStatus } from '@/lib/types'

async function getDashboardStats() {
  const [leadsResult, tripsResult] = await Promise.all([
    supabase.from('leads').select('*, trip:trips(*)'),
    supabase.from('trips').select('*'),
  ])

  const leads = leadsResult.data || []
  const trips = tripsResult.data || []

  const totalLeads = leads.length
  const leadsByStatus: Record<LeadStatus, number> = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    VIBE_CHECK_SENT: 0,
    CONFIRMED: 0,
    NOT_A_FIT: 0,
  }

  leads.forEach((lead) => {
    leadsByStatus[lead.status as LeadStatus]++
  })

  const leadsByTrip = trips.map((trip) => ({
    tripName: trip.name,
    count: leads.filter((l) => l.trip_id === trip.id).length,
  }))

  return {
    totalLeads,
    leadsByStatus,
    leadsByTrip,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
            <p className="text-ink/70">Overview of leads and trips</p>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Leads
          </a>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-ink/70 mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-ink">{stats.totalLeads}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-ink/70 mb-2">New Leads</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.leadsByStatus.NEW}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-ink/70 mb-2">Qualified</h3>
            <p className="text-3xl font-bold text-green-600">{stats.leadsByStatus.QUALIFIED}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-ink/70 mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-emerald-600">{stats.leadsByStatus.CONFIRMED}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-ink mb-4">Leads by Pipeline Stage</h2>
            <div className="space-y-3">
              {Object.entries(stats.leadsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-ink">{status.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium text-ink">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-ink mb-4">Leads by Trip</h2>
            <div className="space-y-3">
              {stats.leadsByTrip.map((item) => (
                <div key={item.tripName} className="flex items-center justify-between">
                  <span className="text-sm text-ink">{item.tripName}</span>
                  <span className="text-sm font-medium text-ink">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
