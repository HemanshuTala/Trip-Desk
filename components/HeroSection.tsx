'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowDown, FiMapPin } from 'react-icons/fi'
import { RiCompassDiscoverLine } from 'react-icons/ri'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax background on scroll
    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Floating badge
    gsap.to(floatRef.current, {
      y: -12,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <div ref={heroRef} className="relative min-h-[100vh] flex flex-col overflow-hidden">

      {/* ── Full-bleed parallax background ─────────── */}
      <div ref={bgRef} className="absolute inset-0 scale-110 -z-0">
        <img
          src="/images/hero_travel.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Multi-layer overlay: bottom dark, top lighter for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        {/* Rust tint strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* ── Decorative grid lines ───────────────────── */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '80px 80px' }}
      />

      {/* ── Main hero content ───────────────────────── */}
      <div className="relative z-10 flex-grow flex items-center">
        <div className="container mx-auto px-6 md:px-14 max-w-6xl pt-20 pb-32 md:pt-28 md:pb-40 grid md:grid-cols-12 gap-10 items-end">

          {/* Left — headline block */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-cream/20 bg-cream/10 backdrop-blur-sm text-[9px] tracking-widest uppercase font-bold text-cream/80 font-sans">
                <RiCompassDiscoverLine className="w-3.5 h-3.5 text-sand" />
                Slow Travel Departures · India
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="text-[38px] sm:text-[60px] md:text-[80px] lg:text-[95px] font-display font-bold text-cream leading-[1.0] tracking-tight mb-8"
            >
              Travel that<br />
              <span className="text-sand italic whitespace-nowrap inline-block">
                <TypeAnimation
                  sequence={[
                    'finds you.', 3200,
                    'slows down.', 2400,
                    'feels real.', 2400,
                    'stays with you.', 2800,
                    'finds you.', 0,
                  ]}
                  wrapper="span"
                  speed={45}
                  deletionSpeed={65}
                  repeat={Infinity}
                  cursor
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-base md:text-lg text-cream/65 leading-relaxed max-w-lg font-sans font-light mb-10"
            >
              We design slow, offbeat, small-group journeys for people who want a trip to feel personal. Every itinerary is screened, curated, and run by our own team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#journeys"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-rust text-cream font-bold text-[11px] tracking-widest uppercase transition-all duration-300 hover:bg-sand hover:text-ink shadow-lg shadow-rust/30 hover:shadow-sand/20 active:scale-[0.97]"
              >
                Explore Journeys
                <FiArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 px-8 py-4 border border-cream/30 text-cream/80 font-bold text-[11px] tracking-widest uppercase hover:bg-cream/10 hover:border-cream/50 transition-all duration-200 backdrop-blur-sm"
              >
                Start a Conversation
              </a>
            </motion.div>
          </div>

          {/* Right — floating trip card */}
          <div className="md:col-span-4 flex flex-col gap-3 items-end">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div ref={floatRef} className="bg-cream/10 backdrop-blur-md border border-cream/20 p-5 w-56 shadow-2xl">
                <div className="text-[8px] uppercase tracking-widest text-sand/70 font-sans mb-3 font-bold">Next Departure</div>
                <div className="font-display text-xl font-bold text-cream leading-tight mb-1">Spiti Valley</div>
                <div className="flex items-center gap-1.5 text-[10px] text-cream/60 font-sans mb-3">
                  <FiMapPin className="w-3 h-3 text-sand/60" />
                  Himachal Pradesh
                </div>
                <div className="border-t border-cream/15 pt-3 flex justify-between text-[9px] text-cream/50 font-sans uppercase tracking-wider">
                  <span>July 2026</span>
                  <span className="text-sand">12 seats</span>
                </div>
              </div>
            </motion.div>

            {/* Second mini card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-rust/80 backdrop-blur-md border border-rust/40 p-4 w-44 shadow-xl"
            >
              <div className="text-[8px] uppercase tracking-widest text-cream/60 font-sans mb-1 font-bold">Opening Soon</div>
              <div className="font-display text-base font-bold text-cream leading-tight">Goa Foraging</div>
              <div className="text-[9px] text-cream/50 font-sans mt-1">Sept 2026</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom stats bar ────────────────────────── */}
      <div className="relative z-10 border-t border-cream/10 bg-ink/60 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-6 md:px-14 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: '4', label: 'Active Routes' },
            { val: '≤14', label: 'Max Group Size' },
            { val: '100%', label: 'In-House Team' },
            { val: '48h', label: 'Response Time' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
              className="text-center md:text-left border-r border-cream/10 last:border-r-0 pr-4 last:pr-0"
            >
              <span className="block text-2xl font-sans font-bold text-sand tracking-tight">{s.val}</span>
              <span className="block text-[9px] uppercase tracking-wider text-cream/40 font-sans font-semibold mt-0.5">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
