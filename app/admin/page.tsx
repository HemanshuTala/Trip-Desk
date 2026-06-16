import { supabase } from '@/lib/supabase'
import { Lead, Trip } from '@/lib/types'
import LeadList from '@/components/LeadList'

async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, trip:trips(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export default async function AdminPage() {
  const leads = await getLeads()
  const trips = await getTrips()

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink">Lead Management</h1>
            <p className="text-ink/70">Manage and track traveller enquiries</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/admin/trips"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Manage Trips
            </a>
            <a
              href="/admin/dashboard"
              className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust/90 transition-colors"
            >
              Dashboard
            </a>
          </div>
        </header>

        <LeadList leads={leads} trips={trips} />
      </div>
    </div>
  )
}
