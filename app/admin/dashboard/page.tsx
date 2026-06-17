import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Lead, Trip, LeadStatus } from '@/lib/types'
import DashboardClient from '@/components/DashboardClient'

async function getDashboardStats(supabase: any) {
  const [leadsResult, tripsResult] = await Promise.all([
    supabase.from('leads').select('*, trip:trips(*)'),
    supabase.from('trips').select('*'),
  ])

  const leads = (leadsResult.data || []) as Lead[]
  const trips = (tripsResult.data || []) as Trip[]

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
  const cookieStore = await cookies()
  const supabase = getSupabaseServer(cookieStore)
  const stats = await getDashboardStats(supabase)

  return <DashboardClient stats={stats} />
}
