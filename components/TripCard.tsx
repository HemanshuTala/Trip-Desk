import { Trip } from '@/lib/types'

interface TripCardProps {
  trip: Trip
}

export default function TripCard({ trip }: TripCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-ink mb-2">{trip.name}</h3>
        <p className="text-ink/70 mb-4 line-clamp-2">{trip.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-ink/80">
            <span className="font-medium w-24">Destination:</span>
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center text-ink/80">
            <span className="font-medium w-24">Dates:</span>
            <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
          </div>
          <div className="flex items-center text-ink/80">
            <span className="font-medium w-24">Price:</span>
            <span className="font-semibold text-rust">{formatPrice(trip.price_including_gst)}</span>
          </div>
          <div className="flex items-center text-ink/80">
            <span className="font-medium w-24">Seats:</span>
            <span>{trip.total_seats} available</span>
          </div>
        </div>
      </div>
    </div>
  )
}
