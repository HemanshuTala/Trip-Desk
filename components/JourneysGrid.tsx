'use client'

import { motion } from 'framer-motion'
import { FiGlobe } from 'react-icons/fi'
import TripCard from '@/components/TripCard'
import { Trip } from '@/lib/types'

interface JourneysGridProps {
  trips: Trip[]
}

export default function JourneysGrid({ trips }: JourneysGridProps) {
  const [featured, ...rest] = trips

  return (
    <section id="journeys" className="py-24 scroll-mt-20">
      {/* ── Section header ─────────────────────── */}
      <div className="container mx-auto px-6 md:px-14 max-w-6xl mb-14">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-sand/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div>
            <span className="text-[9px] uppercase tracking-widest text-rust font-bold block mb-3 font-sans">
              Seasonal departures · {new Date().getFullYear()}
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-ink leading-tight">
              Open Journeys
            </h2>
          </div>
          <p className="text-sm text-ink/45 max-w-xs font-sans font-light leading-relaxed md:text-right">
            Small-group experiences with real itineraries, real hosts, and real landscapes. No tourist-trail packages.
          </p>
        </motion.div>
      </div>

      {trips.length === 0 ? (
        <div className="container mx-auto px-6 md:px-14 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-sand/30 py-28 text-center"
          >
            <FiGlobe className="w-14 h-14 text-sand/50 mx-auto mb-5" />
            <p className="font-display text-2xl font-bold text-ink mb-3">No open journeys right now</p>
            <p className="text-xs text-ink/35 font-sans font-light">Check back soon for our next seasonal release.</p>
          </motion.div>
        </div>
      ) : (
        <>
          {/* ── Featured first trip (full-bleed inside container) ── */}
          {featured && (
            <div className="container mx-auto px-6 md:px-14 max-w-6xl mb-7">
              <div className="grid grid-cols-1">
                <TripCard trip={featured} index={0} featured />
              </div>
            </div>
          )}

          {/* ── Remaining trips in 3-col grid ── */}
          {rest.length > 0 && (
            <div className="container mx-auto px-6 md:px-14 max-w-6xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} index={i + 1} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
