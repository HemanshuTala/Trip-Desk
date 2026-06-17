'use client'

import { motion } from 'framer-motion'
import { FiMapPin, FiUsers, FiStar } from 'react-icons/fi'
import { RiLeafLine, RiHandHeartLine } from 'react-icons/ri'
import { TbRoute } from 'react-icons/tb'

const pillars = [
  {
    icon: <TbRoute className="w-5 h-5" />,
    num: '01',
    title: 'Handpicked routes',
    desc: 'Every destination is chosen for depth, not popularity. We go to places that reward attention and patience.',
  },
  {
    icon: <FiUsers className="w-5 h-5" />,
    num: '02',
    title: 'Small by design',
    desc: 'Groups never exceed 14 people. The size is intentional. You will know everyone by day two.',
  },
  {
    icon: <RiHandHeartLine className="w-5 h-5" />,
    num: '03',
    title: 'Real accountability',
    desc: 'Our team runs every trip, start to finish. No third-party operators. No handoffs. No surprises.',
  },
  {
    icon: <RiLeafLine className="w-5 h-5" />,
    num: '04',
    title: 'Slow by intention',
    desc: 'We build itineraries around stillness. Two nights in one place beats five cities in a week.',
  },
]

export default function WhyNomichi() {
  return (
    <section className="bg-ink text-cream overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6 md:px-14 py-24 grid md:grid-cols-2 gap-16 items-center">

        {/* ── Left: section copy ─── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[9px] uppercase tracking-widest text-rust font-bold block mb-4 font-sans">
              Why Nomichi
            </span>
            <h2 className="text-5xl md:text-[56px] font-display font-bold text-cream leading-[1.05] tracking-tight mb-6">
              We believe travel<br />
              <em className="text-sand font-normal">should feel like something</em>
            </h2>
            <p className="text-sm text-cream/55 font-sans font-light leading-relaxed max-w-sm mb-10">
              Most group tours exist to move you quickly through a checklist. We exist for the opposite reason.
            </p>

            {/* Large image */}
            <div className="relative">
              <div className="aspect-[16/9] overflow-hidden border border-cream/10">
                <img
                  src="/images/coorg_coffee.png"
                  alt="Coffee Trail Walk"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-[1.03] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-[9px] uppercase tracking-widest text-cream/60 font-sans">Coorg, Karnataka</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Right: pillar list ─── */}
        <div className="space-y-0">
          {pillars.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex gap-6 py-7 border-b border-cream/10 last:border-b-0 cursor-default"
            >
              <div className="shrink-0 w-10 h-10 border border-cream/15 flex items-center justify-center text-rust/80 group-hover:bg-rust group-hover:text-cream group-hover:border-rust transition-all duration-300">
                {p.icon}
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-[9px] text-cream/20 font-mono tracking-widest">{p.num}</span>
                  <h3 className="font-display text-xl font-bold text-cream group-hover:text-sand transition-colors duration-200">{p.title}</h3>
                </div>
                <p className="text-xs text-cream/50 font-sans font-light leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
