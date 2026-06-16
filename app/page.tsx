import { supabase } from '@/lib/supabase'
import { Trip } from '@/lib/types'
import TripCard from '@/components/TripCard'
import EnquiryForm from '@/components/EnquiryForm'

async function getOpenTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('status', 'open')
    .order('start_date', { ascending: true })

  if (error) throw error
  return data || []
}

export default async function Home() {
  const trips = await getOpenTrips()

  return (
    <main className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            Travel that finds you
          </h1>
          <p className="text-lg text-ink/70 max-w-2xl mx-auto">
            Slow, offbeat, small-group journeys designed for people who want a trip to feel personal
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Open Trips</h2>
          {trips.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-ink/70">No trips currently available. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>

        <section className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-ink mb-6">Send an Enquiry</h2>
          <EnquiryForm trips={trips} />
        </section>
      </div>
    </main>
  )
}
