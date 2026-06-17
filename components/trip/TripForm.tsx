'use client'

import { TripStatus } from '@/lib/types'

interface TripFormProps {
  isCreating: boolean
  isSaving: boolean
  formData: {
    name: string
    destination: string
    start_date: string
    end_date: string
    price_including_gst: string
    total_seats: string
    status: TripStatus
    description: string
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    destination: string
    start_date: string
    end_date: string
    price_including_gst: string
    total_seats: string
    status: TripStatus
    description: string
  }>>
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export default function TripForm({
  isCreating,
  isSaving,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: TripFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 mb-8">
      <h2 className="text-lg font-display font-bold text-ink mb-6">
        {isCreating ? 'Create New Trip' : 'Edit Trip'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-5">
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
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 border border-sand/45 text-ink text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-cream/45 transition-all font-sans active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
