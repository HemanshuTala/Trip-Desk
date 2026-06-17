'use client'

import { Trip } from '@/lib/types'
import { Plus, Edit, Trash2, MapPin, Calendar, Users } from 'lucide-react'

interface TripListProps {
  trips: Trip[]
  userRole: 'admin' | 'agent'
  isSaving: boolean
  isDeleting: string | null
  onEdit: (trip: Trip) => void
  onDelete: (id: string) => void
  onCreateClick: () => void
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
}

export default function TripList({
  trips,
  userRole,
  isSaving,
  isDeleting,
  onEdit,
  onDelete,
  onCreateClick,
  formatPrice,
  formatDate,
}: TripListProps) {
  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
      {trips.length === 0 ? (
        <div className="p-10 text-center">
          <MapPin className="w-10 h-10 text-sand mx-auto mb-4" />
          <p className="text-ink/70 text-sm font-sans mb-3">No trips created yet.</p>
          <button
            onClick={onCreateClick}
            className="text-rust hover:text-rust/85 font-semibold text-xs tracking-wider uppercase font-sans flex items-center gap-1.5 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create your first trip
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cream/40 border-b border-sand/20">
                <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Trip Name
                </th>
                <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Destination
                </th>
                <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Price (inc. GST)
                </th>
                <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Seats
                </th>
                <th className="px-6 py-4 text-left text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[9px] font-semibold text-ink/60 uppercase tracking-widest font-sans">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/15">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-cream/25 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-ink font-sans">{trip.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-ink font-sans">
                    {trip.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-ink/70 font-sans font-light">
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-ink font-semibold font-sans">
                    {formatPrice(trip.price_including_gst)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-ink font-sans">
                    {trip.total_seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full font-sans ${
                      trip.status === 'open' ? 'bg-olive text-cream' : 'bg-sand/30 text-ink/70'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => onEdit(trip)}
                        disabled={isSaving}
                        className="text-olive hover:text-olive/85 transition-colors font-bold uppercase tracking-wider text-[10px] font-sans flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      {userRole === 'admin' ? (
                        <button
                          onClick={() => onDelete(trip.id)}
                          disabled={isDeleting === trip.id}
                          className="text-rust hover:text-rust/80 transition-colors font-bold uppercase tracking-wider text-[10px] font-sans flex items-center gap-1 ml-4"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {isDeleting === trip.id ? 'Deleting...' : 'Delete'}
                        </button>
                      ) : (
                        <span
                          className="text-ink/30 text-[10px] italic font-sans flex items-center gap-1 cursor-not-allowed ml-4"
                          title="Trip deletion is restricted to administrators only."
                        >
                          Delete Restricted
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
