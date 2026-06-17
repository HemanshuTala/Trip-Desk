'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <nav
      className="sticky top-0 left-0 right-0 z-50 bg-ink border-b border-sand/20 py-4 transition-all duration-300"
    >
        <div className="container mx-auto px-6 md:px-14 max-w-6xl flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <span className="font-display font-bold text-2xl tracking-wide text-cream">Nomichi</span>
            <span className={`hidden md:block text-[8px] tracking-widest uppercase font-light border-l pl-4 transition-colors duration-300 ${scrolled ? 'text-cream/30 border-cream/15' : 'text-cream/35 border-cream/10'}`}>
              Travel that finds you
            </span>
          </motion.div>

          {/* Desktop links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#journeys" className="text-[10px] tracking-widest uppercase font-bold text-cream/55 hover:text-cream transition-colors">
              Journeys
            </a>
            <a href="#enquiry" className="text-[10px] tracking-widest uppercase font-bold text-cream/55 hover:text-cream transition-colors">
              Enquire
            </a>
            <a
              href="/login"
              className="px-5 py-2.5 text-[10px] tracking-widest uppercase font-bold transition-all duration-200 bg-rust text-cream border border-rust hover:bg-rust/90 active:scale-[0.98]"
            >
              Team Portal
            </a>
          </motion.div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-cream/80 hover:text-cream"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-14 left-0 right-0 z-40 bg-ink/98 border-b border-cream/10 px-6 py-6 space-y-4 md:hidden"
        >
          <a href="#journeys" onClick={() => setMenuOpen(false)} className="block text-[11px] tracking-widest uppercase font-bold text-cream/70 hover:text-cream py-2">Journeys</a>
          <a href="#enquiry" onClick={() => setMenuOpen(false)} className="block text-[11px] tracking-widest uppercase font-bold text-cream/70 hover:text-cream py-2">Enquire</a>
          <a href="/login" className="block text-[11px] tracking-widest uppercase font-bold text-cream/70 hover:text-cream py-2">Team Portal</a>
        </motion.div>
      )}
    </>
  )
}
