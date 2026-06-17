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
  NEW: 'bg-cream text-ink border border-sand/40',
  CONTACTED: 'bg-sand/20 text-ink border border-sand/40',
  QUALIFIED: 'bg-olive text-cream',
  VIBE_CHECK_SENT: 'bg-olive/75 text-sand border border-olive/35',
  CONFIRMED: 'bg-rust text-cream',
  NOT_A_FIT: 'bg-ink text-sand/85',
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
          className="px-4 py-2 bg-olive text-cream rounded-lg hover:bg-olive/90 transition-all duration-200 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-sm font-sans active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-sand" />
          Export CSV
        </button>
      </div>

      {userRole === 'agent' && (
        <div className="mb-6 p-4 bg-white border border-sand/35 rounded-2xl text-xs text-ink/80 font-sans shadow-sm leading-relaxed">
          You are viewing your own leads and those not yet assigned. Reach out to an administrator for any owner changes.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 mb-8">
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
              Search Leads
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-olive/60" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Press Enter"
                className="w-full pl-9 pr-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-ink text-xs font-sans transition-all placeholder-ink/30"
              />
            </form>
          </div>

          <div>
            <label htmlFor="status" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
              Filter Status
            </label>
            <select
              id="status"
              value={initialStatus}
              onChange={(e) => updateParams({ status: e.target.value })}
              className="w-full px-3 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-ink text-xs font-sans transition-all cursor-pointer"
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
            <label htmlFor="trip" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
              Filter Trip
            </label>
            <select
              id="trip"
              value={initialTrip}
              onChange={(e) => updateParams({ trip: e.target.value })}
              className="w-full px-3 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-ink text-xs font-sans transition-all cursor-pointer"
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
            <label htmlFor="owner" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
              Filter Owner
            </label>
            <select
              id="owner"
              value={initialOwner}
              onChange={(e) => updateParams({ owner: e.target.value })}
              className="w-full px-3 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-ink text-xs font-sans transition-all cursor-pointer"
            >
              <option value="ALL">All Owners</option>
              {currentUserId && <option value="MINE">My Leads ({mineCount})</option>}
              <option value="UNASSIGNED">Unassigned</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2.5 border border-sand/45 rounded-lg hover:bg-cream/40 transition-all duration-200 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink font-sans active:scale-[0.98]"
            >
              <X className="w-3.5 h-3.5 text-rust" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden mb-8">
        {leads.length === 0 ? (
          <div className="p-10 text-center">
            <Filter className="w-10 h-10 text-sand mx-auto mb-4" />
            <p className="text-ink/70 text-sm font-sans mb-3">No leads found matching your criteria.</p>
            <button
              onClick={handleClearFilters}
              className="text-rust hover:text-rust/85 font-semibold text-xs tracking-wider uppercase font-sans"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cream/40 border-b border-sand/20">
                  <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Traveller
                  </th>
                  <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Trip Interest
                  </th>
                  <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Enquired On
                  </th>
                  <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Group Type
                  </th>
                  <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Assignment
                  </th>
                  <th className="px-6 py-4 text-right text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/15">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-cream/25 transition-colors duration-150 cursor-pointer"
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-semibold text-ink font-sans">{lead.name}</div>
                      <div className="text-[11px] text-ink/50 font-sans font-light mt-0.5">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-ink font-sans">{lead.trip?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full font-sans ${STATUS_COLORS[lead.status]}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-ink/70 font-sans font-light">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[10px] text-ink/75 font-sans font-light bg-sand/10 border border-sand/20 px-2 py-0.5 rounded-full capitalize">
                        {lead.group_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-ink/70 font-sans font-light">
                      {lead.owner_id ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                          Assigned
                        </span>
                      ) : (
                        <span className="text-ink/40">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/admin/leads/${lead.id}`)
                        }}
                        className="text-rust hover:text-rust/80 font-bold transition-colors uppercase tracking-wider text-[10px] font-sans flex items-center gap-1 ml-auto"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white rounded-2xl border border-sand/35 px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="text-xs text-ink/65 font-sans">
            Showing Page <span className="font-semibold text-ink">{currentPage}</span> of{' '}
            <span className="font-semibold text-ink">{totalPages}</span> ({totalLeads} total leads)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParams({ page: (currentPage - 1).toString() })}
              disabled={currentPage <= 1}
              className="p-2 border border-sand/40 rounded-lg hover:bg-cream/45 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-ink bg-white active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateParams({ page: (currentPage + 1).toString() })}
              disabled={currentPage >= totalPages}
              className="p-2 border border-sand/40 rounded-lg hover:bg-cream/45 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-ink bg-white active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
