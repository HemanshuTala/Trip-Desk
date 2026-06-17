'use client'

import { useRef, useEffect } from 'react'
import { Trip } from '@/lib/types'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiMapPin, FiCalendar, FiUsers, FiArrowUpRight } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

interface TripCardProps {
  trip: Trip
  index?: number
  featured?: boolean
}

const TRIP_IMAGES: Record<string, string> = {
  'Himalayan Village Walk': '/images/spiti_valley.png',
  'Coastal Foraging Journey': '/images/goa_foraging.png',
  'Desert Star Camp': '/images/rajasthan_desert.png',
  'Coffee Trail Walk': '/images/coorg_coffee.png',
}

export default function TripCard({ trip, index = 0, featured = false }: TripCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imagePath = TRIP_IMAGES[trip.name] || '/images/hero_travel.png'

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const from = featured
      ? { opacity: 0, y: 40 }
      : { opacity: 0, y: 60 }

    gsap.fromTo(el, from, {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: index * 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    })
  }, [index, featured])

  if (featured) {
    return (
      <div ref={cardRef} className="group relative overflow-hidden bg-ink col-span-full">
        {/* Full-bleed image */}
        <div className="aspect-[21/9] w-full overflow-hidden">
          <img
            src={imagePath}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1400ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end p-10 md:p-14">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-rust text-cream text-[9px] font-bold uppercase tracking-widest font-sans">
                Featured Journey
              </span>
              <span className="flex items-center gap-1 text-[10px] text-cream/60 font-sans uppercase tracking-wider">
                <FiMapPin className="w-3 h-3 text-sand/60" />
                {trip.destination}
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4 leading-tight">{trip.name}</h3>
            <p className="text-sm text-cream/65 font-sans font-light leading-relaxed mb-6 max-w-sm line-clamp-2">{trip.description}</p>
            <div className="flex items-center gap-8 mb-6">
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-cream/35 font-sans mb-1">Starting from</span>
                <span className="text-3xl font-sans font-bold text-sand tracking-tight">{formatPrice(trip.price_including_gst)}</span>
              </div>
              <div className="flex gap-5 text-[10px] text-cream/50 font-sans">
                <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5 text-sand/50" />{formatDate(trip.start_date)}</span>
                <span className="flex items-center gap-1.5"><FiUsers className="w-3.5 h-3.5 text-sand/50" />{trip.total_seats} seats</span>
              </div>
            </div>
            <a
              href="#enquiry"
              className="group/btn inline-flex items-center gap-2 px-6 py-3.5 bg-rust text-cream text-[11px] font-bold tracking-widest uppercase hover:bg-sand hover:text-ink transition-all duration-200 shadow-lg shadow-rust/30"
            >
              Enquire About This Trip
              <FiArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className="group relative bg-white overflow-hidden border border-sand/20 hover:border-sand/50 shadow-[0_4px_24px_rgba(28,27,26,0.05)] hover:shadow-[0_16px_48px_rgba(28,27,26,0.12)] transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={imagePath}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-cream/80 font-bold font-sans">
            <FiMapPin className="w-3 h-3 text-sand/70" />
            {trip.destination}
          </span>
          <span className={`px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest font-sans ${
            trip.status === 'open' ? 'bg-olive text-cream' : 'bg-ink/60 text-cream/70 border border-cream/10'
          }`}>
            {trip.status}
          </span>
        </div>

        {/* Trip name on image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-display font-bold text-cream leading-tight group-hover:text-sand transition-colors duration-300">
            {trip.name}
          </h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <p className="text-xs text-ink/60 mb-5 line-clamp-2 leading-relaxed flex-grow font-sans font-light">{trip.description}</p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-sand/30 text-[10px] text-ink/65 font-sans font-medium">
            <FiCalendar className="w-3 h-3 text-olive/60" />
            {formatDate(trip.start_date)}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-sand/30 text-[10px] text-ink/65 font-sans font-medium">
            <FiUsers className="w-3 h-3 text-olive/60" />
            {trip.total_seats} seats
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-sand/15">
          <div>
            <span className="block text-[8px] uppercase tracking-widest text-ink/30 font-sans font-semibold mb-0.5">Incl. GST</span>
            <span className="text-xl font-sans font-bold text-rust tracking-tight">{formatPrice(trip.price_including_gst)}</span>
          </div>
          <a
            href="#enquiry"
            className="group/btn inline-flex items-center gap-1.5 px-4 py-2.5 bg-ink text-cream text-[10px] font-bold tracking-widest uppercase hover:bg-rust transition-all duration-200"
          >
            Enquire
            <FiArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  )
}
