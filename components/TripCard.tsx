import { Trip } from '@/lib/types'
import { MapPin, Calendar, Users, IndianRupee } from 'lucide-react'

interface TripCardProps {
  trip: Trip
}

const TRIP_IMAGES: Record<string, string> = {
  'Himalayan Village Walk': '/images/spiti_valley.png',
  'Coastal Foraging Journey': '/images/goa_foraging.png',
  'Desert Star Camp': '/images/rajasthan_desert.png',
  'Coffee Trail Walk': '/images/coorg_coffee.png',
}

export default function TripCard({ trip }: TripCardProps) {
  const imagePath = TRIP_IMAGES[trip.name] || '/images/hero_travel.png'

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-sand/30 hover:border-rust/35 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden bg-cream">
        <img
          src={imagePath}
          alt={trip.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 right-3 bg-cream/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-xs font-semibold text-olive uppercase tracking-wider border border-sand/30">
          {trip.status}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-xs text-olive/80 uppercase tracking-widest font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{trip.destination}</span>
        </div>
        
        <h3 className="text-xl font-display font-bold text-ink mb-2 group-hover:text-rust transition-colors leading-tight">
          {trip.name}
        </h3>
        
        <p className="text-sm text-ink/70 mb-6 line-clamp-3 leading-relaxed flex-grow">
          {trip.description}
        </p>
        
        <div className="space-y-3 pt-4 border-t border-sand/20 text-sm mt-auto">
          <div className="flex items-center gap-2.5 text-ink/75">
            <Calendar className="w-4 h-4 text-olive/70" />
            <span>{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
          </div>
          
          <div className="flex items-center gap-2.5 text-ink/75">
            <Users className="w-4 h-4 text-olive/70" />
            <span>{trip.total_seats} seats total</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-ink/50 uppercase font-semibold tracking-wider">Price inclusive GST</span>
            <span className="text-lg font-bold text-rust">{formatPrice(trip.price_including_gst)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
