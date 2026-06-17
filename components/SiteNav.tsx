'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi'

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#1C1B1A]/90 backdrop-blur-md border-b border-[#D1B788]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
            : 'bg-transparent py-6 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 md:px-14 max-w-6xl flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="font-display font-bold text-2xl tracking-wide text-[#FFFBF5]">Nomichi</span>
            <span className={`hidden md:block text-[8px] tracking-[0.2em] uppercase font-light border-l pl-4 transition-all duration-300 ${
              scrolled ? 'text-[#FFFBF5]/40 border-[#FFFBF5]/15' : 'text-[#FFFBF5]/50 border-[#FFFBF5]/10'
            }`}>
              Travel that finds you
            </span>
          </motion.div>

          {/* Desktop links */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8 font-sans"
          >
            <a 
              href="#journeys" 
              className="group relative text-[10px] tracking-widest uppercase font-bold text-[#FFFBF5]/65 hover:text-[#FFFBF5] transition-colors duration-300 py-1"
            >
              Journeys
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D55D27] group-hover:w-full transition-all duration-350 ease-out" />
            </a>
            <a 
              href="#enquiry" 
              className="group relative text-[10px] tracking-widest uppercase font-bold text-[#FFFBF5]/65 hover:text-[#FFFBF5] transition-colors duration-300 py-1"
            >
              Enquire
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D55D27] group-hover:w-full transition-all duration-350 ease-out" />
            </a>
            <a
              href="/login"
              className="group flex items-center gap-1.5 px-4 py-2 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 bg-[#D55D27] text-[#FFFBF5] hover:bg-[#FFFBF5] hover:text-[#1C1B1A] border border-[#D55D27] hover:border-[#FFFBF5] shadow-sm active:scale-[0.98]"
            >
              Team Portal
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-[#FFFBF5]/80 hover:text-[#FFFBF5] transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-14 left-0 right-0 z-40 bg-[#1C1B1A]/98 backdrop-blur-lg border-b border-[#D1B788]/20 px-8 py-8 space-y-4 md:hidden font-sans"
          >
            <a 
              href="#journeys" 
              onClick={() => setMenuOpen(false)} 
              className="block text-[11px] tracking-widest uppercase font-bold text-[#FFFBF5]/70 hover:text-[#FFFBF5] py-2 border-b border-[#FFFBF5]/5 transition-colors"
            >
              Journeys
            </a>
            <a 
              href="#enquiry" 
              onClick={() => setMenuOpen(false)} 
              className="block text-[11px] tracking-widest uppercase font-bold text-[#FFFBF5]/70 hover:text-[#FFFBF5] py-2 border-b border-[#FFFBF5]/5 transition-colors"
            >
              Enquire
            </a>
            <a 
              href="/login" 
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-[11px] tracking-widest uppercase font-bold text-[#D55D27] hover:text-[#FFFBF5] py-2 transition-colors"
            >
              <span>Team Portal</span>
              <FiArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
