'use client'

import { useState, useEffect } from 'react'
import { Trip } from '@/lib/types'
import { GroupType } from '@/lib/types'
import { getSupabaseBrowser } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'

interface EnquiryFormProps {
  trips: Trip[]
  dark?: boolean
}

export default function EnquiryForm({ trips, dark = false }: EnquiryFormProps) {
  const labelCls = `block text-[10px] uppercase tracking-widest font-semibold mb-2 font-sans ${dark ? 'text-cream/60' : 'text-ink/70'}`
  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm focus:ring-1 focus:outline-none transition-all duration-200 text-xs font-sans placeholder-opacity-40 ${
      dark
        ? `bg-white/5 text-cream placeholder-cream/30 focus:ring-rust/40 ${hasError ? 'border-rust' : 'border-cream/15 focus:border-rust'} dark-select`
        : `bg-cream/15 text-ink placeholder-ink/30 focus:ring-rust/30 ${hasError ? 'border-rust' : 'border-sand/40 focus:border-rust'}`
    }`
  const errorCls = 'text-rust text-[10px] mt-1.5 font-sans font-medium'
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

  useEffect(() => {
    const handleSelectTrip = (e: Event) => {
      const customEvent = e as CustomEvent<{ tripId: string }>
      if (customEvent.detail?.tripId) {
        setFormData(prev => ({ ...prev, trip_id: customEvent.detail.tripId }))
      }
    }
    window.addEventListener('select-trip', handleSelectTrip)
    return () => window.removeEventListener('select-trip', handleSelectTrip)
  }, [])

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
      <div className={`border p-10 text-center shadow-sm ${dark ? 'bg-white/5 border-cream/10' : 'bg-white border-sand/40'}`}>
        <div className={`w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-6 ${dark ? 'bg-white/5 border-cream/15' : 'bg-cream border-sand/35'}`}>
          <CheckCircle className="w-8 h-8 text-rust" />
        </div>
        <h3 className={`text-2xl font-display font-bold mb-3 ${dark ? 'text-cream' : 'text-ink'}`}>Thank you for your enquiry</h3>
        <p className={`mb-8 font-sans leading-relaxed text-xs max-w-sm mx-auto font-light ${dark ? 'text-cream/60' : 'text-ink/75'}`}>
          We have received your details and will get in touch with you soon. We look forward to talking about your trip.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-rust text-cream hover:bg-rust/90 font-bold text-[10px] tracking-widest uppercase transition-all duration-200 active:scale-[0.98] border border-rust"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className={`border p-12 text-center shadow-sm ${dark ? 'bg-white/5 border-cream/10' : 'bg-white border-sand/40'}`}>
        <p className={`text-xs font-sans font-light ${dark ? 'text-cream/50' : 'text-ink/60'}`}>No trips available to enquire about.</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`border p-8 transition-all duration-300 ${
        dark
          ? 'bg-white/5 border-cream/10 backdrop-blur-sm'
          : 'bg-white border-sand/45 shadow-[0_4px_24px_rgba(28,27,26,0.02)] hover:shadow-md'
      }`}
    >
      <div className={`border-b pb-6 mb-8 ${dark ? 'border-cream/10' : 'border-sand/30'}`}>
        <span className="text-[9px] uppercase tracking-widest text-rust font-bold block mb-1 font-sans">Nomichi Explorers</span>
        <h3 className={`text-2xl font-display font-bold leading-tight ${dark ? 'text-cream' : 'text-ink'}`}>Journey Enquiry</h3>
        <p className={`text-xs font-sans mt-2 font-light ${dark ? 'text-cream/50' : 'text-ink/60'}`}>
          Complete this brief questionnaire. We read every response carefully.
        </p>
      </div>

      {errors.submit && (
        <div className="bg-rust/10 border border-rust/30 text-rust px-4 py-3 rounded-sm mb-6 text-xs font-sans">
          {errors.submit}
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelCls}>Name *</label>
            <input
              id="name" name="name" type="text"
              value={formData.name} onChange={handleChange}
              className={inputCls(!!errors.name)}
              placeholder="Your full name"
            />
            {errors.name && <p className={errorCls}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelCls}>Phone *</label>
            <input
              id="phone" name="phone" type="tel"
              value={formData.phone} onChange={handleChange}
              className={inputCls(!!errors.phone)}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className={errorCls}>{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>Email *</label>
          <input
            id="email" name="email" type="email"
            value={formData.email} onChange={handleChange}
            className={inputCls(!!errors.email)}
            placeholder="you@example.com"
          />
          {errors.email && <p className={errorCls}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="trip_id" className={labelCls}>Select Journey *</label>
          <select
            id="trip_id" name="trip_id"
            value={formData.trip_id} onChange={handleChange}
            className={inputCls(!!errors.trip_id) + ' cursor-pointer'}
          >
            <option value="">Select a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name} – {trip.destination}
              </option>
            ))}
          </select>
          {errors.trip_id && <p className={errorCls}>{errors.trip_id}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="group_type" className={labelCls}>Travelling style *</label>
            <select
              id="group_type" name="group_type"
              value={formData.group_type} onChange={handleChange}
              className={inputCls(false) + ' cursor-pointer'}
            >
              <option value="solo">Solo</option>
              <option value="friends">Friends</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
            </select>
          </div>
          <div>
            <label htmlFor="preferred_month" className={labelCls}>Preferred Month *</label>
            <input
              id="preferred_month" name="preferred_month" type="text"
              value={formData.preferred_month} onChange={handleChange}
              className={inputCls(!!errors.preferred_month)}
              placeholder="October 2026"
            />
            {errors.preferred_month && <p className={errorCls}>{errors.preferred_month}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="vibe_description" className={labelCls}>What are you hoping this trip feels like *</label>
          <textarea
            id="vibe_description" name="vibe_description"
            value={formData.vibe_description} onChange={handleChange}
            rows={4}
            className={inputCls(!!errors.vibe_description) + ' resize-none leading-relaxed'}
            placeholder="Describe the pace, atmosphere, and feeling you are looking for..."
          />
          {errors.vibe_description && <p className={errorCls}>{errors.vibe_description}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rust text-cream py-4 font-bold text-[10px] tracking-widest uppercase hover:bg-rust/90 border border-rust active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sans mt-1"
        >
          {isSubmitting ? 'Sending Request...' : 'Submit Enquiry'}
        </button>
      </div>
    </form>
  )
}

