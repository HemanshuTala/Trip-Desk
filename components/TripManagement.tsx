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
          className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust/90 transition-colors"
        >
          Create New Trip
        </button>
      </div>

      {(isCreating || editingTrip) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-display font-bold text-ink mb-4">
            {isCreating ? 'Create New Trip' : 'Edit Trip'}
          </h2>
          <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
                  Trip Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                  placeholder="Himalayan Village Walk"
                />
              </div>

              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-ink mb-2">
                  Destination *
                </label>
                <input
                  id="destination"
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                  placeholder="Spiti Valley"
                />
              </div>

              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-ink mb-2">
                  Start Date *
                </label>
                <input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-ink mb-2">
                  End Date *
                </label>
                <input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-ink mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                  placeholder="45000"
                />
              </div>

              <div>
                <label htmlFor="seats" className="block text-sm font-medium text-ink mb-2">
                  Total Seats *
                </label>
                <input
                  id="seats"
                  type="number"
                  value={formData.total_seats}
                  onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                  placeholder="12"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-ink mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TripStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-ink mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none resize-none"
                placeholder="A slow walk through ancient villages in Spiti..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-rust text-white rounded-lg hover:bg-rust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : (isCreating ? 'Create Trip' : 'Update Trip')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {trips.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-ink/70 mb-2">No trips yet.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-rust hover:underline font-medium flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create your first trip
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
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-ink">{trip.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                    {trip.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink/70">
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink font-medium">
                    {formatPrice(trip.price_including_gst)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                    {trip.total_seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trip.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => startEdit(trip)}
                      disabled={isSaving}
                      className="text-rust hover:underline font-medium mr-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    {userRole === 'admin' ? (
                      <button
                        onClick={() => handleDelete(trip.id)}
                        disabled={isDeleting === trip.id}
                        className="text-red-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting === trip.id ? 'Deleting...' : 'Delete'}
                      </button>
                    ) : (
                      <span
                        className="text-gray-400 text-xs italic font-sans flex items-center gap-1 cursor-not-allowed"
                        title="Trip deletion is restricted to administrators only."
                      >
                        Delete Restricted
                      </span>
                    )}
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
