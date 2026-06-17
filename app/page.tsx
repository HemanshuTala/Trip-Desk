import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Trip } from '@/lib/types'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import HeroSection from '@/components/HeroSection'
import MarqueeStrip from '@/components/MarqueeStrip'
import WhyNomichi from '@/components/WhyNomichi'
import JourneysGrid from '@/components/JourneysGrid'
import QuoteBanner from '@/components/QuoteBanner'
import EnquirySection from '@/components/EnquirySection'

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
  } catch (error: any) {
    console.error('Error fetching open trips:', error?.message || error)
    return []
  }
}

export default async function Home() {
  const trips = await getOpenTrips()

  return (
    <main className="min-h-screen bg-cream flex flex-col text-ink selection:bg-yellow selection:text-ink">
      <SiteNav />
      <HeroSection />
      <MarqueeStrip />
      <WhyNomichi />
      <JourneysGrid trips={trips} />
      <QuoteBanner />
      <EnquirySection trips={trips} />
      <SiteFooter />
    </main>
  )
}
