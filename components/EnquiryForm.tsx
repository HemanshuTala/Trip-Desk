'use client'

import { useState } from 'react'
import { Trip } from '@/lib/types'
import { GroupType } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface EnquiryFormProps {
  trips: Trip[]
}

export default function EnquiryForm({ trips }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    trip_id: '',
    group_type: 'solo' as GroupType,
    preferred_month: '',
    vibe_description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.trip_id) {
      newErrors.trip_id = 'Please select a trip'
    }

    if (!formData.preferred_month.trim()) {
      newErrors.preferred_month = 'Preferred month is required'
    }

    if (!formData.vibe_description.trim()) {
      newErrors.vibe_description = 'Please tell us what you are hoping for'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          trip_id: formData.trip_id,
          group_type: formData.group_type,
          preferred_month: formData.preferred_month,
          vibe_description: formData.vibe_description,
          status: 'NEW',
        })

      if (error) throw error

      setSubmitSuccess(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        trip_id: '',
        group_type: 'solo',
        preferred_month: '',
        vibe_description: '',
      })
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      setErrors({ submit: 'Failed to submit enquiry. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">Thank you for your enquiry</h3>
        <p className="text-ink/70 mb-6">
          We have received your enquiry and will get in touch with you soon.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="text-rust hover:underline font-medium"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="trip_id" className="block text-sm font-medium text-ink mb-2">
            Trip *
          </label>
          <select
            id="trip_id"
            name="trip_id"
            value={formData.trip_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none ${
              errors.trip_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name} - {trip.destination}
              </option>
            ))}
          </select>
          {errors.trip_id && <p className="text-red-600 text-sm mt-1">{errors.trip_id}</p>}
        </div>

        <div>
          <label htmlFor="group_type" className="block text-sm font-medium text-ink mb-2">
            Group Type *
          </label>
          <select
            id="group_type"
            name="group_type"
            value={formData.group_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none"
          >
            <option value="solo">Solo</option>
            <option value="friends">Friends</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferred_month" className="block text-sm font-medium text-ink mb-2">
            Preferred Month *
          </label>
          <input
            id="preferred_month"
            name="preferred_month"
            type="text"
            value={formData.preferred_month}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none ${
              errors.preferred_month ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="June 2025"
          />
          {errors.preferred_month && <p className="text-red-600 text-sm mt-1">{errors.preferred_month}</p>}
        </div>

        <div>
          <label htmlFor="vibe_description" className="block text-sm font-medium text-ink mb-2">
            What are you hoping this trip feels like *
          </label>
          <textarea
            id="vibe_description"
            name="vibe_description"
            value={formData.vibe_description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none resize-none ${
              errors.vibe_description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell us what you are looking for in this trip..."
          />
          {errors.vibe_description && <p className="text-red-600 text-sm mt-1">{errors.vibe_description}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rust text-white py-3 rounded-lg font-medium hover:bg-rust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
        </button>
      </div>
    </form>
  )
}
