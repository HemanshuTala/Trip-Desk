'use client'

import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

const destinations = [
  { name: 'Spiti Valley', img: '/images/spiti_valley.png', tag: 'Himachal Pradesh' },
  { name: 'Rajasthan Desert', img: '/images/rajasthan_desert.png', tag: 'Rajasthan' },
  { name: 'Goa Foraging', img: '/images/goa_foraging.png', tag: 'Goa' },
]

export default function QuoteBanner() {
  return (
    <section className="bg-cream py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-14 max-w-6xl">

        {/* ── Editorial quote ─── */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-[9px] uppercase tracking-widest text-rust font-bold block mb-6 font-sans">Our philosophy</span>
          <blockquote className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight max-w-3xl mx-auto">
            &ldquo;The right trip does not just take you somewhere.{' '}
            <em className="text-rust/80 font-normal">It tells you something about yourself.&rdquo;</em>
          </blockquote>
        </motion.div>

        {/* ── 3-col destination images ─── */}
        <div className="grid grid-cols-3 gap-3">
          {destinations.map((d, i) => (
            <motion.div
              key={d.name}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.12 }}
              whileHover="hover"
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent group-hover:from-ink/90 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="block text-[8px] uppercase tracking-widest text-cream/55 font-sans mb-1">{d.tag}</span>
                <span className="block font-display text-xl font-bold text-cream">{d.name}</span>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-rust/0 group-hover:bg-rust flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <FiArrowRight className="w-4 h-4 text-cream" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Full-bleed dark strip ─── */}
        <div className="relative mt-6 overflow-hidden h-48">
          <img src="/images/rajasthan_desert.png" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-ink/80" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-cream/80 text-sm font-sans font-light tracking-[0.15em] uppercase"
            >
              Slow · Offbeat · Honest · Personal
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
