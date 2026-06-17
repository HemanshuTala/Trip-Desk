'use client'

import { useState } from 'react'
import { Trip, TripStatus } from '@/lib/types'
import { getSupabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TripForm from './trip/TripForm'
import TripList from './trip/TripList'

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
        <TripForm
          isCreating={isCreating}
          isSaving={isSaving}
          formData={formData}
          setFormData={setFormData}
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={resetForm}
        />
      )}

      <TripList
        trips={trips}
        userRole={userRole}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onEdit={startEdit}
        onDelete={handleDelete}
        onCreateClick={() => setIsCreating(true)}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />
    </div>
  )
}
