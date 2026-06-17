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
    <div className="bg-white rounded-2xl overflow-hidden border border-sand/25 hover:border-rust/30 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full">
      <div className="relative h-52 w-full overflow-hidden bg-cream">
        <img
          src={imagePath}
          alt={trip.name}
          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />
        <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-olive uppercase tracking-wider border border-sand/40 shadow-sm">
          {trip.status}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-[11px] text-olive/90 uppercase tracking-widest font-semibold mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-rust/80" />
          <span>{trip.destination}</span>
        </div>
        
        <h3 className="text-xl font-display font-bold text-ink mb-3 group-hover:text-rust transition-colors leading-snug">
          {trip.name}
        </h3>
        
        <p className="text-sm text-ink/75 mb-6 line-clamp-3 leading-relaxed flex-grow font-light">
          {trip.description}
        </p>
        
        <div className="space-y-3 pt-5 border-t border-sand/20 text-sm mt-auto font-sans">
          <div className="flex items-center gap-3 text-ink/80">
            <Calendar className="w-4 h-4 text-olive/60" />
            <span className="font-light">{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-ink/80">
            <Users className="w-4 h-4 text-olive/60" />
            <span className="font-light">{trip.total_seats} seats total</span>
          </div>
 
          <div className="flex items-center justify-between pt-3 border-t border-sand/10">
            <span className="text-[10px] text-ink/40 uppercase tracking-wider font-semibold">Price inclusive GST</span>
            <span className="text-xl font-display font-bold text-rust">{formatPrice(trip.price_including_gst)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
