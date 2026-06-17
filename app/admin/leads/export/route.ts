import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Lead } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseServer(cookieStore)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tripId = searchParams.get('trip_id')

    let query = supabase
      .from('leads')
      .select('*, trip:trips(*)')
      .order('created_at', { ascending: false })

    if (status && status !== 'ALL') {
      query = query.eq('status', status)
    }

    if (tripId && tripId !== 'ALL') {
      query = query.eq('trip_id', tripId)
    }

    const { data, error } = await query

    if (error) throw error

    // Convert to CSV
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Trip',
      'Destination',
      'Status',
      'Group Type',
      'Preferred Month',
      'Vibe Description',
      'Created At',
      'Owner ID',
    ]

    const rows = (data as Lead[])?.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.trip?.name || '',
      lead.trip?.destination || '',
      lead.status,
      lead.group_type,
      lead.preferred_month,
      `"${lead.vibe_description.replace(/"/g, '""')}"`,
      new Date(lead.created_at).toLocaleDateString('en-IN'),
      lead.owner_id || '',
    ]) || []

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads-export.csv"',
      },
    })
  } catch (error) {
    console.error('Error exporting leads:', error)
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    )
  }
}
