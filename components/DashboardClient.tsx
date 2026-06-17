'use client'

import { motion, Variants } from 'framer-motion'
import { Lead, Trip, LeadStatus } from '@/lib/types'
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  PartyPopper, 
  ArrowLeft, 
  TrendingUp, 
  Map, 
  Percent,
  Sparkles,
  Zap,
  PhoneCall,
  ThumbsUp,
  Smile,
  Award,
  XCircle,
  Compass,
  ListTodo
} from 'lucide-react'

interface DashboardClientProps {
  stats: {
    totalLeads: number
    leadsByStatus: Record<LeadStatus, number>
    leadsByTrip: { tripName: string; count: number }[]
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'NEW':
      return <Sparkles className="w-3.5 h-3.5 text-[#D1B788] shrink-0" />
    case 'CONTACTED':
      return <PhoneCall className="w-3.5 h-3.5 text-[#D1B788] shrink-0" />
    case 'QUALIFIED':
      return <ThumbsUp className="w-3.5 h-3.5 text-[#45471D] shrink-0" />
    case 'VIBE_CHECK_SENT':
      return <Smile className="w-3.5 h-3.5 text-[#D55D27] shrink-0" />
    case 'CONFIRMED':
      return <Award className="w-3.5 h-3.5 text-[#D55D27] shrink-0" />
    case 'NOT_A_FIT':
      return <XCircle className="w-3.5 h-3.5 text-[#1C1B1A]/60 shrink-0" />
    default:
      return null
  }
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const conversionRate = stats.totalLeads > 0 
    ? ((stats.leadsByStatus.CONFIRMED / stats.totalLeads) * 100).toFixed(0)
    : '0'
    
  const activeFollowups = stats.leadsByStatus.CONTACTED + stats.leadsByStatus.QUALIFIED + stats.leadsByStatus.VIBE_CHECK_SENT

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 12 } }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] font-sans antialiased relative overflow-hidden">
      {/* Decorative grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(209,183,136,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(209,183,136,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-16 py-12 relative z-10 max-w-7xl">
        
        {/* TOP COMPACT BRAND NAVIGATION */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10 border-b border-[#1C1B1A]/10 pb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-display font-semibold tracking-wider text-[#1C1B1A]">NOMICHI</span>
            <span className="text-[#1C1B1A]/30 text-xs">|</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#45471D] font-bold font-sans">CRM Insights</span>
          </div>
          <a
            href="/admin"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1C1B1A]/70 hover:text-[#D55D27] transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to leads list
          </a>
        </motion.div>

        {/* HEADER HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1C1B1A] tracking-tight leading-none mb-3">
            Operational Telemetry
          </h1>
          <p className="text-sm text-[#1C1B1A]/60 max-w-xl font-light leading-relaxed">
            A comprehensive look at customer inquiries, booking pipelines, and trip-by-trip distributions.
          </p>
        </motion.div>

        {/* METRICS ROW (ELEGANT INTEGRATED BOARD WITH STAGGERED ENTRANCE) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white border border-[#D1B788]/40 shadow-sm rounded-xl overflow-hidden grid sm:grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D1B788]/30 mb-12"
        >
          {/* Stat 1 */}
          <motion.div variants={cardVariants} className="p-8 hover:bg-[#FFFBF5]/30 transition-colors duration-200">
            <span className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[#1C1B1A]/40 mb-3">Total Inquiries</span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-sans font-bold text-[#1C1B1A] tracking-tight">{stats.totalLeads}</span>
              <span className="text-[10px] font-medium text-[#45471D] bg-[#45471D]/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-[10px] text-[#1C1B1A]/50 font-light font-sans">Total inquiries registered in database.</p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div variants={cardVariants} className="p-8 hover:bg-[#FFFBF5]/30 transition-colors duration-200">
            <span className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[#1C1B1A]/40 mb-3">Needs Attention</span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-sans font-bold text-[#D55D27] tracking-tight">{stats.leadsByStatus.NEW}</span>
              {stats.leadsByStatus.NEW > 0 && (
                <span className="text-[10px] font-medium text-[#D55D27] bg-[#D55D27]/10 px-2 py-0.5 rounded-full animate-pulse">Action Required</span>
              )}
            </div>
            <p className="text-[10px] text-[#1C1B1A]/50 font-light font-sans">New inquiries awaiting initial agent contact.</p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div variants={cardVariants} className="p-8 hover:bg-[#FFFBF5]/30 transition-colors duration-200">
            <span className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[#1C1B1A]/40 mb-3">Active Nurture</span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-sans font-bold text-[#45471D] tracking-tight">{activeFollowups}</span>
              <span className="text-[10px] font-medium text-[#1C1B1A]/60 bg-[#1C1B1A]/5 px-2 py-0.5 rounded-full">In Progress</span>
            </div>
            <p className="text-[10px] text-[#1C1B1A]/50 font-light font-sans">Leads in Contacted, Qualified, or Vibe check.</p>
          </motion.div>

          {/* Stat 4 */}
          <motion.div variants={cardVariants} className="p-8 hover:bg-[#FFFBF5]/30 transition-colors duration-200">
            <span className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[#1C1B1A]/40 mb-3">Booking Conversion</span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-sans font-bold text-[#D55D27] tracking-tight">{conversionRate}%</span>
              <span className="text-xs text-[#1C1B1A]/40">({stats.leadsByStatus.CONFIRMED} leads)</span>
            </div>
            <p className="text-[10px] text-[#1C1B1A]/50 font-light font-sans">Ratio of total inquiries successfully confirmed.</p>
          </motion.div>
        </motion.div>

        {/* SECTIONS GRID */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Column 1: Pipeline Stage Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="border-b border-[#1C1B1A]/10 pb-4 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-xl font-display font-bold text-[#1C1B1A]">Pipeline Stages</h2>
                <p className="text-xs text-[#1C1B1A]/40 font-sans mt-0.5">Where travelers are in their booking journey.</p>
              </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {Object.entries(stats.leadsByStatus).map(([status, count]) => {
                const pct = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0
                const hasLeads = count > 0
                
                let textColor = 'text-[#D1B788]'
                let barColor = 'bg-[#D1B788]'
                if (status === 'CONFIRMED') {
                  textColor = 'text-[#D55D27]'
                  barColor = 'bg-[#D55D27]'
                } else if (status === 'QUALIFIED') {
                  textColor = 'text-[#45471D]'
                  barColor = 'bg-[#45471D]'
                } else if (status === 'VIBE_CHECK_SENT') {
                  textColor = 'text-[#D55D27]/80'
                  barColor = 'bg-[#D55D27]/80'
                } else if (status === 'NOT_A_FIT') {
                  textColor = 'text-[#1C1B1A]/60'
                  barColor = 'bg-[#1C1B1A]/60'
                }

                return (
                  <motion.div 
                    variants={itemVariants}
                    key={status} 
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                      hasLeads 
                        ? 'bg-white border-[#D1B788]/30 shadow-sm hover:border-[#D55D27]/40 hover:-translate-y-0.5' 
                        : 'opacity-30 border-[#1C1B1A]/5 bg-transparent'
                    }`}
                  >
                    <div className="w-1/3 min-w-[120px] flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1C1B1A]">
                        {status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="bg-[#FFFBF5] border border-[#D1B788]/15 w-full h-1.5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                          className={`h-full rounded-full ${barColor}`}
                        />
                      </div>
                    </div>

                    <div className="text-right w-16">
                      <span className={`text-xs font-bold font-sans ${textColor}`}>{count}</span>
                      <span className="block text-[8px] text-[#1C1B1A]/40 font-sans mt-0.5">{pct.toFixed(0)}%</span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Column 2: Destination Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="border-b border-[#1C1B1A]/10 pb-4 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-xl font-display font-bold text-[#1C1B1A]">Destinations</h2>
                <p className="text-xs text-[#1C1B1A]/40 font-sans mt-0.5">Popularity index of currently active trips.</p>
              </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {stats.leadsByTrip.map((item) => {
                const pct = stats.totalLeads > 0 ? (item.count / stats.totalLeads) * 100 : 0
                const hasLeads = item.count > 0
                
                return (
                  <motion.div 
                    variants={itemVariants}
                    key={item.tripName} 
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                      hasLeads 
                        ? 'bg-white border-[#D1B788]/30 shadow-sm hover:border-[#45471D]/40 hover:-translate-y-0.5' 
                        : 'opacity-30 border-[#1C1B1A]/5 bg-transparent'
                    }`}
                  >
                    <div className="w-1/3 min-w-[120px] flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-[#45471D] shrink-0" />
                      <span className="text-[11px] font-bold text-[#1C1B1A] tracking-tight truncate">
                        {item.tripName}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="bg-[#FFFBF5] border border-[#D1B788]/15 w-full h-1.5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
                          className="h-full rounded-full bg-[#45471D]"
                        />
                      </div>
                    </div>

                    <div className="text-right w-16">
                      <span className="text-xs font-bold font-sans text-[#45471D]">{item.count}</span>
                      <span className="block text-[8px] text-[#1C1B1A]/40 font-sans mt-0.5">{pct.toFixed(0)}%</span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

        </div>

      </div>
    </div>
  )
}
