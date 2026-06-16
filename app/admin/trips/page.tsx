import { supabase } from '@/lib/supabase'
import { Trip } from '@/lib/types'
import TripManagement from '@/components/TripManagement'

async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) throw error
  return data || []
}

export default async function TripsPage() {
  const trips = await getTrips()

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink">Trip Management</h1>
            <p className="text-ink/70">Create and manage trips</p>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Leads
          </a>
        </header>

        <TripManagement trips={trips} />
      </div>
    </div>
  )
}
