'use client'

import { useState } from 'react'
import { Trip } from '@/lib/types'
import { GroupType } from '@/lib/types'
import { getSupabaseBrowser } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'

interface EnquiryFormProps {
  trips: Trip[]
}

export default function EnquiryForm({ trips }: EnquiryFormProps) {
  const supabase = getSupabaseBrowser()
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
      <div className="bg-white rounded-2xl border border-sand/30 shadow-lg p-10 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-cream border border-sand/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
          <CheckCircle className="w-10 h-10 text-rust" />
        </div>
        <h3 className="text-2xl font-display font-bold text-ink mb-3">Thank you for your enquiry</h3>
        <p className="text-ink/75 mb-8 font-sans leading-relaxed text-sm">
          We have received your details and will get in touch with you soon. We look forward to talking about your trip.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-rust text-white text-sm font-medium rounded-md hover:bg-rust/95 active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sand/30 p-10 text-center">
        <p className="text-ink/75">No trips available to enquire about.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sand/35 shadow-lg p-8 md:p-10 hover:shadow-xl transition-shadow duration-300">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-sans">
          {errors.submit}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-cream/30 border rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none transition-all duration-200 text-ink placeholder-ink/30 font-sans ${
              errors.name ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-sand/40'
            }`}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1.5 font-sans">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-cream/30 border rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none transition-all duration-200 text-ink placeholder-ink/30 font-sans ${
              errors.phone ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-sand/40'
            }`}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1.5 font-sans">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-cream/30 border rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none transition-all duration-200 text-ink placeholder-ink/30 font-sans ${
              errors.email ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-sand/40'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1.5 font-sans">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="trip_id" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            Trip *
          </label>
          <select
            id="trip_id"
            name="trip_id"
            value={formData.trip_id}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-cream/30 border rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none transition-all duration-200 text-ink font-sans ${
              errors.trip_id ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-sand/40'
            }`}
          >
            <option value="">Select a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id} className="text-ink">
                {trip.name} - {trip.destination}
              </option>
            ))}
          </select>
          {errors.trip_id && <p className="text-red-600 text-xs mt-1.5 font-sans">{errors.trip_id}</p>}
        </div>

        <div>
          <label htmlFor="group_type" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            Group Type *
          </label>
          <select
            id="group_type"
            name="group_type"
            value={formData.group_type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-cream/30 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none transition-all duration-200 text-ink font-sans"
          >
            <option value="solo">Solo</option>
            <option value="friends">Friends</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferred_month" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            Preferred Month *
          </label>
          <input
            id="preferred_month"
            name="preferred_month"
            type="text"
            value={formData.preferred_month}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-cream/30 border rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none transition-all duration-200 text-ink placeholder-ink/30 font-sans ${
              errors.preferred_month ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-sand/40'
            }`}
            placeholder="June 2025"
          />
          {errors.preferred_month && <p className="text-red-600 text-xs mt-1.5 font-sans">{errors.preferred_month}</p>}
        </div>

        <div>
          <label htmlFor="vibe_description" className="block text-xs uppercase tracking-wider font-semibold text-ink/70 mb-2 font-sans">
            What are you hoping this trip feels like *
          </label>
          <textarea
            id="vibe_description"
            name="vibe_description"
            value={formData.vibe_description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 bg-cream/30 border rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none resize-none transition-all duration-200 text-ink placeholder-ink/30 font-sans ${
              errors.vibe_description ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-sand/40'
            }`}
            placeholder="Tell us what you are looking for in this trip..."
          />
          {errors.vibe_description && <p className="text-red-600 text-xs mt-1.5 font-sans">{errors.vibe_description}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rust text-white py-4 rounded-lg font-medium hover:bg-rust/95 active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-sans mt-2"
        >
          {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
        </button>
      </div>
    </form>
  )
}
