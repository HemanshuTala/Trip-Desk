'use client'

import { motion } from 'framer-motion'
import { FiCheck, FiMail, FiPhone, FiInstagram } from 'react-icons/fi'
import EnquiryForm from '@/components/EnquiryForm'
import { Trip } from '@/lib/types'

interface EnquirySectionProps {
  trips: Trip[]
}

const promises = [
  'Personal response from our team, not a bot',
  'No commitment required to enquire',
  'We will tell you honestly if the trip is not a fit',
]

export default function EnquirySection({ trips }: EnquirySectionProps) {
  if (trips.length === 0) {
    return (
      <div className="bg-ink py-20 text-center px-6 border-t border-cream/10">
        <p className="text-cream/30 text-xs font-sans font-light tracking-widest uppercase">When new journeys open, the enquiry form will appear here.</p>
      </div>
    )
  }

  return (
    <section id="enquiry" className="relative bg-ink scroll-mt-20 overflow-hidden">
      {/* Background texture grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      {/* Rust glow blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rust/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="relative container mx-auto max-w-6xl px-6 md:px-14 py-28 grid md:grid-cols-2 gap-20 items-start">

        {/* ── Left — editorial copy ── */}
        <motion.div
          className="pt-2"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
        >
          <span className="text-[9px] uppercase tracking-widest text-rust font-bold block mb-4 font-sans">
            Start a conversation
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-cream leading-tight mb-6">
            Tell us about<br />
            <em className="text-sand font-normal">your journey</em>
          </h2>
          <p className="text-sm text-cream/50 font-sans font-light leading-relaxed max-w-sm mb-12">
            We read every response personally. Tell us what you are hoping for and we will reach out within 48 hours to talk through whether there is a fit.
          </p>

          {/* Promise list */}
          <div className="space-y-5 mb-14">
            {promises.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-6 h-6 border border-rust/40 bg-rust/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheck className="w-3.5 h-3.5 text-rust" />
                </div>
                <span className="text-xs text-cream/50 font-sans font-light leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Contact strip */}
          <div className="border-t border-cream/10 pt-8 space-y-3">
            <p className="text-[9px] uppercase tracking-widest text-cream/25 font-bold font-sans mb-4">Or reach us directly</p>
            <a href="mailto:hello@nomichi.in" className="flex items-center gap-3 text-xs text-cream/45 hover:text-cream transition-colors font-sans group">
              <FiMail className="w-4 h-4 text-rust/70 group-hover:text-rust transition-colors" />
              hello@nomichi.in
            </a>
            <a href="tel:+91" className="flex items-center gap-3 text-xs text-cream/45 hover:text-cream transition-colors font-sans group">
              <FiPhone className="w-4 h-4 text-rust/70 group-hover:text-rust transition-colors" />
              +91 (available on WhatsApp)
            </a>
            <a href="#" className="flex items-center gap-3 text-xs text-cream/45 hover:text-cream transition-colors font-sans group">
              <FiInstagram className="w-4 h-4 text-rust/70 group-hover:text-rust transition-colors" />
              @nomichi.travel
            </a>
          </div>
        </motion.div>

        {/* ── Right — form ── */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          <EnquiryForm trips={trips} dark />
        </motion.div>
      </div>
    </section>
  )
}
