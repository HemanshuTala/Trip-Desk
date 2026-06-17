export type TripStatus = 'open' | 'closed'

export type LeadStatus = 
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'VIBE_CHECK_SENT'
  | 'CONFIRMED'
  | 'NOT_A_FIT'

export type GroupType = 'solo' | 'friends' | 'couple' | 'family'

export interface Trip {
  id: string
  name: string
  destination: string
  start_date: string
  end_date: string
  price_including_gst: number
  total_seats: number
  status: TripStatus
  description: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  trip_id: string
  group_type: GroupType
  preferred_month: string
  vibe_description: string
  status: LeadStatus
  owner_id?: string
  created_at: string
  updated_at: string
  trip?: Trip
}

export interface CallLog {
  id: string
  lead_id: string
  notes: string
  next_action?: string
  created_at: string
  created_by?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'agent'
  created_at: string
}
