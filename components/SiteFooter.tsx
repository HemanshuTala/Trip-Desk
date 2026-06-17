'use client'

import { FiArrowUpRight, FiInstagram, FiMail, FiPhone } from 'react-icons/fi'

export default function SiteFooter() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-[#D1B788]/20 bg-[#FFFBF5] relative overflow-hidden py-16 px-6 font-sans text-[#1C1B1A]">
      {/* Decorative vertical divider line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#D1B788]/5 pointer-events-none hidden md:block" />

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pb-12 border-b border-[#D1B788]/15">
          
          {/* Col 1: Brand Signature */}
          <div className="space-y-4">
            <span 
              onClick={handleScrollTop}
              className="font-display font-bold text-2xl tracking-wide text-[#1C1B1A] cursor-pointer hover:text-[#D55D27] transition-colors"
            >
              Nomichi
            </span>
            <p className="text-xs text-[#1C1B1A]/50 font-light leading-relaxed max-w-xs">
              We design slow, offbeat, small-group journeys for people who want their travel to feel personal and still.
            </p>
            <div className="pt-2">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#45471D] bg-[#45471D]/5 border border-[#45471D]/10 px-3 py-1 rounded-full">
                Travel that finds you
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1C1B1A]/40">Quick Access</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#1C1B1A]/70">
              <li>
                <a href="#journeys" className="hover:text-[#D55D27] transition-colors flex items-center gap-1.5 group">
                  Active Journeys
                  <FiArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#enquiry" className="hover:text-[#D55D27] transition-colors flex items-center gap-1.5 group">
                  Submit Enquiry
                  <FiArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#D55D27] transition-colors flex items-center gap-1.5 group">
                  Staff Workspace
                  <FiArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Brand Core & Contacts */}
          <div className="space-y-4">
            <h4 className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#1C1B1A]/40">Our Philosophy</h4>
            <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-[#45471D]">
              <span>Wander</span>
              <span className="text-[#D1B788]">·</span>
              <span>Connect</span>
              <span className="text-[#D1B788]">·</span>
              <span>Belong</span>
            </div>
            <p className="text-[10px] text-[#1C1B1A]/40 font-light leading-relaxed">
              No tourist lists, no em-dashes, no checklist itineraries. Just deep travel, and slow pacing.
            </p>
          </div>

        </div>

        {/* Footer Bottom Block */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 text-[10px] text-[#1C1B1A]/45">
          <div className="flex flex-wrap items-center gap-2 font-light">
            <span>© {new Date().getFullYear()} Nomichi Explorers Private Limited.</span>
            <span className="hidden sm:inline text-[#D1B788]">|</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="mailto:hello@nomichi.in" title="Email Us" className="hover:text-[#D55D27] transition-colors">
              <FiMail className="w-4 h-4" />
            </a>
            <a href="tel:+91" title="WhatsApp Us" className="hover:text-[#D55D27] transition-colors">
              <FiPhone className="w-4 h-4" />
            </a>
            <a href="#" title="Instagram" className="hover:text-[#D55D27] transition-colors">
              <FiInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
