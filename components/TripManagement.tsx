'use client'

import { useState } from 'react'
import { Trip, TripStatus } from '@/lib/types'
import { getSupabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Calendar, MapPin, Users, DollarSign } from 'lucide-react'

interface TripManagementProps {
  trips: Trip[]
  userRole?: 'admin' | 'agent'
}

export default function TripManagement({ trips: initialTrips, userRole = 'agent' }: TripManagementProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const [trips, setTrips] = useState(initialTrips)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: '',
    price_including_gst: '',
    total_seats: '',
    status: 'open' as TripStatus,
    description: '',
  })

  const resetForm = () => {
    setFormData({
      name: '',
      destination: '',
      start_date: '',
      end_date: '',
      price_including_gst: '',
      total_seats: '',
      status: 'open',
      description: '',
    })
    setIsCreating(false)
    setEditingTrip(null)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('trips')
        .insert({
          name: formData.name,
          destination: formData.destination,
          start_date: formData.start_date,
          end_date: formData.end_date,
          price_including_gst: parseFloat(formData.price_including_gst),
          total_seats: parseInt(formData.total_seats),
          status: formData.status,
          description: formData.description,
        })

      if (error) throw error

      const { data } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true })

      setTrips(data || [])
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error creating trip:', error)
      alert('Failed to create trip')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTrip) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('trips')
        .update({
          name: formData.name,
          destination: formData.destination,
          start_date: formData.start_date,
          end_date: formData.end_date,
          price_including_gst: parseFloat(formData.price_including_gst),
          total_seats: parseInt(formData.total_seats),
          status: formData.status,
          description: formData.description,
        })
        .eq('id', editingTrip.id)

      if (error) throw error

      const { data } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true })

      setTrips(data || [])
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error updating trip:', error)
      alert('Failed to update trip')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return
    setIsDeleting(id)

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTrips(trips.filter(t => t.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Failed to delete trip')
    } finally {
      setIsDeleting(null)
    }
  }

  const startEdit = (trip: Trip) => {
    setEditingTrip(trip)
    setFormData({
      name: trip.name,
      destination: trip.destination,
      start_date: trip.start_date,
      end_date: trip.end_date,
      price_including_gst: trip.price_including_gst.toString(),
      total_seats: trip.total_seats.toString(),
      status: trip.status,
      description: trip.description,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-rust text-cream rounded-lg hover:bg-rust/95 active:scale-[0.98] transition-all duration-200 text-xs font-semibold tracking-wider uppercase font-sans shadow-sm"
        >
          Create New Trip
        </button>
      </div>

      {(isCreating || editingTrip) && (
        <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 mb-8">
          <h2 className="text-lg font-display font-bold text-ink mb-6">
            {isCreating ? 'Create New Trip' : 'Edit Trip'}
          </h2>
          <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  Trip Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-xs font-sans transition-all text-ink placeholder-ink/30"
                  placeholder="Himalayan Village Walk"
                />
              </div>

              <div>
                <label htmlFor="destination" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  Destination *
                </label>
                <input
                  id="destination"
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-xs font-sans transition-all text-ink placeholder-ink/30"
                  placeholder="Spiti Valley"
                />
              </div>

              <div>
                <label htmlFor="start_date" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  Start Date *
                </label>
                <input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-xs font-sans transition-all text-ink"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  End Date *
                </label>
                <input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-xs font-sans transition-all text-ink"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  Price (including GST) *
                </label>
                <input
                  id="price"
                  type="number"
                  value={formData.price_including_gst}
                  onChange={(e) => setFormData({ ...formData, price_including_gst: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-xs font-sans transition-all text-ink placeholder-ink/30"
                  placeholder="45000"
                />
              </div>

              <div>
                <label htmlFor="seats" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  Total Seats *
                </label>
                <input
                  id="seats"
                  type="number"
                  value={formData.total_seats}
                  onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-xs font-sans transition-all text-ink placeholder-ink/30"
                  placeholder="12"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                  Booking Status *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TripStatus })}
                  className="w-full px-3 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-ink text-xs font-sans transition-all cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/75 mb-2 font-sans">
                Trip Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="w-full px-4 py-3 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none resize-none bg-cream/10 text-xs font-sans transition-all text-ink placeholder-ink/30"
                placeholder="A slow walk through ancient villages in Spiti..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-rust text-cream text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-rust/95 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {isSaving ? 'Saving...' : (isCreating ? 'Create Trip' : 'Update Trip')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="px-4 py-2 border border-sand/45 text-ink text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-cream/45 transition-all font-sans active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        {trips.length === 0 ? (
          <div className="p-10 text-center">
            <MapPin className="w-10 h-10 text-sand mx-auto mb-4" />
            <p className="text-ink/70 text-sm font-sans mb-3">No trips created yet.</p>
            <button
              onClick={() => setIsCreating(true)}
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
                          onClick={() => startEdit(trip)}
                          disabled={isSaving}
                          className="text-olive hover:text-olive/85 transition-colors font-bold uppercase tracking-wider text-[10px] font-sans flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        {userRole === 'admin' ? (
                          <button
                            onClick={() => handleDelete(trip.id)}
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
    </div>
  )
}
