import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Trip } from '@/lib/types'
import TripCard from '@/components/TripCard'
import EnquiryForm from '@/components/EnquiryForm'
import { Mail } from 'lucide-react'

async function getOpenTrips(): Promise<Trip[]> {
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseServer(cookieStore)
    
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'open')
      .order('start_date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching open trips:', error)
    return []
  }
}

export default async function Home() {
  const trips = await getOpenTrips()

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-sand/20 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-2xl tracking-wide text-ink">
            Nomichi
          </span>
        </div>
        <a
          href="/login"
          className="font-sans text-xs tracking-wider uppercase font-semibold text-olive hover:text-rust transition-colors duration-250"
        >
          Team Portal
        </a>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 md:px-12 py-12 md:py-20 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-ink leading-[1.15]">
            Travel that <br />
            <span className="text-rust">finds you</span>
          </h1>
          <p className="text-lg text-ink/85 leading-relaxed max-w-xl font-sans font-light">
            We design slow, offbeat, small-group journeys for people who want a trip to feel personal. Every trip is screened, curated, and run end to end by our own team. We make travel feel personal.
          </p>
          <div className="pt-2">
            <a
              href="#journeys"
              className="inline-flex items-center justify-center px-6 py-3 bg-rust text-white font-medium rounded-md hover:bg-rust/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Explore Journeys
            </a>
          </div>
        </div>
        <div className="md:col-span-5 relative">
          <div className="aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-2xl border border-sand/30 shadow-xl bg-white p-2">
            <img
              src="/images/hero_travel.png"
              alt="Nomichi travel style"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <div id="journeys" className="container mx-auto px-6 md:px-12 py-12 flex-grow space-y-20">
        
        {/* Open Journeys List */}
        <section className="scroll-mt-24">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-3">
              Open Journeys
            </h2>
            <p className="text-ink/60 max-w-lg font-sans">
              Our curated slow-travel experiences with active bookings. Simple schedules, real hosts, and small groups.
            </p>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-xl border border-sand/30 p-12 text-center shadow-sm">
              <p className="text-ink/70 mb-2 font-medium">No trips currently open</p>
              <p className="text-sm text-ink/50">Check back soon for our next seasonal release.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </section>

        {/* Enquiry Form Section */}
        {trips.length > 0 && (
          <section className="max-w-2xl mx-auto py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-ink mb-3 flex justify-center items-center gap-2">
                <Mail className="w-6 h-6 text-rust" />
                Send an Enquiry
              </h2>
              <p className="text-ink/65 text-sm font-sans max-w-md mx-auto">
                Tell us about your interests and preferences. We will review your answers and reach out to start a conversation.
              </p>
            </div>
            <EnquiryForm trips={trips} />
          </section>
        )}

        {trips.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <p className="text-ink/50 text-sm">When new journeys are ready, the submission form will open here.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-sand/20 py-8 px-6 mt-16 bg-white/40">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink/50 font-sans tracking-wide">
          <div>
            © {new Date().getFullYear()} Nomichi Explorers Private Limited
          </div>
          <div className="flex gap-4">
            <span>Wander</span>
            <span>•</span>
            <span>Connect</span>
            <span>•</span>
            <span>Belong</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
