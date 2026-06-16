'use client'

import { useState } from 'react'
import { Lead, Trip, LeadStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface LeadListProps {
  leads: Lead[]
  trips: Trip[]
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  VIBE_CHECK_SENT: 'bg-purple-100 text-purple-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  NOT_A_FIT: 'bg-red-100 text-red-800',
}

export default function LeadList({ leads, trips }: LeadListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL')
  const [tripFilter, setTripFilter] = useState<string>('ALL')

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter
    const matchesTrip = tripFilter === 'ALL' || lead.trip_id === tripFilter

    return matchesSearch && matchesStatus && matchesTrip
  })

  const getStatusCount = (status: LeadStatus) => {
    return leads.filter(l => l.status === status).length
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-ink mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, email, or phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-ink mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW ({getStatusCount('NEW')})</option>
              <option value="CONTACTED">CONTACTED ({getStatusCount('CONTACTED')})</option>
              <option value="QUALIFIED">QUALIFIED ({getStatusCount('QUALIFIED')})</option>
              <option value="VIBE_CHECK_SENT">VIBE CHECK SENT ({getStatusCount('VIBE_CHECK_SENT')})</option>
              <option value="CONFIRMED">CONFIRMED ({getStatusCount('CONFIRMED')})</option>
              <option value="NOT_A_FIT">NOT A FIT ({getStatusCount('NOT_A_FIT')})</option>
            </select>
          </div>

          <div>
            <label htmlFor="trip" className="block text-sm font-medium text-ink mb-2">
              Trip
            </label>
            <select
              id="trip"
              value={tripFilter}
              onChange={(e) => setTripFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
            >
              <option value="ALL">All Trips</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('ALL')
                setTripFilter('ALL')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-ink/70">No leads found matching your criteria.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Trip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/admin/leads/${lead.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-ink">{lead.name}</div>
                    <div className="text-sm text-ink/70">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-ink">{lead.trip?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[lead.status]}`}>
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink/70">
                    {new Date(lead.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink/70">
                    {lead.group_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/leads/${lead.id}`)
                      }}
                      className="text-rust hover:underline font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
