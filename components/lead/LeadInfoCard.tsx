'use client'

import { Lead, LeadStatus } from '@/lib/types'
import { Sparkles } from 'lucide-react'

interface LeadInfoCardProps {
  leadData: Lead
  vibeRating: 'Fit' | 'Neutral' | 'Requires Call' | null
  vibeReason: string
  isVibeChecking: boolean
  canModify: boolean
  STATUS_COLORS: Record<LeadStatus, string>
  handleVibeCheck: () => void
}

export default function LeadInfoCard({
  leadData,
  vibeRating,
  vibeReason,
  isVibeChecking,
  canModify,
  STATUS_COLORS,
  handleVibeCheck,
}: LeadInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2 leading-tight">{leadData.name}</h1>
          <div className="space-y-1 text-xs text-ink/60 font-sans font-light">
            <p>{leadData.email}</p>
            <p>{leadData.phone}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full font-sans ${STATUS_COLORS[leadData.status]}`}>
          {leadData.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-sand/20">
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-ink/40 mb-1.5 font-sans">Trip Interest</h3>
          <p className="text-sm text-ink font-semibold font-sans">{leadData.trip?.name || 'Unknown'}</p>
          <p className="text-xs text-ink/60 font-sans font-light mt-0.5">{leadData.trip?.destination}</p>
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-ink/40 mb-1.5 font-sans">Group Type</h3>
          <p className="text-sm text-ink font-semibold font-sans capitalize">{leadData.group_type}</p>
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-ink/40 mb-1.5 font-sans">Preferred Month</h3>
          <p className="text-sm text-ink font-semibold font-sans">{leadData.preferred_month}</p>
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-ink/40 mb-1.5 font-sans">Created</h3>
          <p className="text-sm text-ink font-semibold font-sans">
            {new Date(leadData.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-sand/20 mt-6">
        <h3 className="text-[10px] uppercase tracking-wider font-semibold text-ink/40 mb-2.5 font-sans">What they hope this trip feels like</h3>
        <p className="text-sm text-ink/80 font-sans leading-relaxed font-light">{leadData.vibe_description}</p>
      </div>

      <div className="pt-6 border-t border-sand/20 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-ink/40 font-sans">AI Vibe Fit Suggestion</h3>
          {!vibeRating && (
            <button
              onClick={handleVibeCheck}
              disabled={isVibeChecking}
              className="px-3 py-1.5 bg-olive/10 hover:bg-olive/20 text-olive text-[10px] font-bold tracking-wider uppercase rounded font-sans transition-colors disabled:opacity-50 flex items-center gap-1.5 border border-olive/10"
            >
              <Sparkles className="w-3 h-3 text-rust" />
              {isVibeChecking ? 'Analyzing...' : 'Run Vibe Check'}
            </button>
          )}
        </div>

        {vibeRating && (
          <div className="bg-cream border border-sand/35 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-ink/50 font-bold uppercase tracking-wider font-sans">Rating:</span>
              <span
                className={`px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full font-sans ${
                  vibeRating === 'Fit'
                    ? 'bg-olive text-cream'
                    : vibeRating === 'Requires Call'
                    ? 'bg-rust text-cream'
                    : 'bg-sand/35 text-ink'
                }`}
              >
                {vibeRating}
              </span>
            </div>
            <p className="text-xs text-ink/85 leading-relaxed font-sans">{vibeReason}</p>
          </div>
        )}
      </div>
    </div>
  )
}
