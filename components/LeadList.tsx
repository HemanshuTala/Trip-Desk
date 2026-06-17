'use client'

import { useState, useEffect } from 'react'
import { Lead, Trip, LeadStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { Search, Download, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LeadListProps {
  leads: Lead[]
  trips: Trip[]
  currentUserId?: string
  userRole?: 'admin' | 'agent'
  totalLeads: number
  currentPage: number
  statusCounts: Record<string, number>
  mineCount: number
  initialSearch: string
  initialStatus: string
  initialTrip: string
  initialOwner: string
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  VIBE_CHECK_SENT: 'bg-purple-100 text-purple-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  NOT_A_FIT: 'bg-red-100 text-red-800',
}

export default function LeadList({
  leads,
  trips,
  currentUserId,
  userRole = 'agent',
  totalLeads,
  currentPage,
  statusCounts,
  mineCount,
  initialSearch,
  initialStatus,
  initialTrip,
  initialOwner,
}: LeadListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  // Sync state if initial value changes (e.g., clearing filters)
  useEffect(() => {
    setSearchQuery(initialSearch)
  }, [initialSearch])

  const updateParams = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(window.location.search)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === 'ALL' || value === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    // Reset page to 1 unless page is explicitly changing
    if (!newParams.page) {
      current.set('page', '1')
    }
    router.push(`/admin?${current.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: searchQuery, page: '1' })
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    router.push('/admin')
  }

  const handleExport = () => {
    const params = new URLSearchParams()
    if (initialStatus !== 'ALL') params.append('status', initialStatus)
    if (initialTrip !== 'ALL') params.append('trip_id', initialTrip)
    window.open(`/admin/leads/export?${params.toString()}`, '_blank')
  }

  const totalPages = Math.max(1, Math.ceil(totalLeads / 20))

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Leads ({totalLeads})
          <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full font-sans ${
            userRole === 'admin'
              ? 'bg-rust/10 text-rust border border-rust/20'
              : 'bg-olive/10 text-olive border border-olive/20'
          }`}>
            {userRole === 'admin' ? 'Admin Portal' : 'Agent Portal'}
          </span>
        </h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors text-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {userRole === 'agent' && (
        <div className="mb-6 p-4 bg-white border border-sand/40 rounded-lg text-sm text-ink/75 font-sans shadow-sm">
          You are viewing your own leads and those not yet assigned. Reach out to an administrator for any owner changes.
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-ink mb-2">
              Search
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Press Enter to search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none bg-white text-ink"
              />
            </form>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-ink mb-2">
              Status
            </label>
            <select
              id="status"
              value={initialStatus}
              onChange={(e) => updateParams({ status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none bg-white text-ink"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW ({statusCounts.NEW})</option>
              <option value="CONTACTED">CONTACTED ({statusCounts.CONTACTED})</option>
              <option value="QUALIFIED">QUALIFIED ({statusCounts.QUALIFIED})</option>
              <option value="VIBE_CHECK_SENT">VIBE CHECK SENT ({statusCounts.VIBE_CHECK_SENT})</option>
              <option value="CONFIRMED">CONFIRMED ({statusCounts.CONFIRMED})</option>
              <option value="NOT_A_FIT">NOT A FIT ({statusCounts.NOT_A_FIT})</option>
            </select>
          </div>

          <div>
            <label htmlFor="trip" className="block text-sm font-medium text-ink mb-2">
              Trip
            </label>
            <select
              id="trip"
              value={initialTrip}
              onChange={(e) => updateParams({ trip: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none bg-white text-ink"
            >
              <option value="ALL">All Trips</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-ink mb-2">
              Owner
            </label>
            <select
              id="owner"
              value={initialOwner}
              onChange={(e) => updateParams({ owner: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none bg-white text-ink"
            >
              <option value="ALL">All Owners</option>
              {currentUserId && <option value="MINE">My Leads ({mineCount})</option>}
              <option value="UNASSIGNED">Unassigned</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm text-ink"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {leads.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-ink/70 mb-2">No leads found matching your criteria.</p>
            <button
              onClick={handleClearFilters}
              className="text-rust hover:underline font-medium text-sm"
            >
              Clear all filters
            </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                >
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink/70">
                    {lead.owner_id ? 'Assigned' : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/leads/${lead.id}`)
                      }}
                      className="text-rust hover:underline font-medium flex items-center gap-1 ml-auto"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border border-sand/20 px-6 py-4">
          <div className="text-sm text-ink/65">
            Showing Page <span className="font-semibold text-ink">{currentPage}</span> of{' '}
            <span className="font-semibold text-ink">{totalPages}</span> ({totalLeads} total leads)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParams({ page: (currentPage - 1).toString() })}
              disabled={currentPage <= 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-ink"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => updateParams({ page: (currentPage + 1).toString() })}
              disabled={currentPage >= totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-ink"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
