'use client'

import { Lead, LeadStatus } from '@/lib/types'
import { FiCheck } from 'react-icons/fi'

interface PipelineStepperProps {
  leadData: Lead
  isUpdatingStatus: boolean
  canModify: boolean
  handleStatusChange: (newStatus: LeadStatus) => void
  PIPELINE_STAGES: LeadStatus[]
  getCurrentStageIndex: () => number
}

export default function PipelineStepper({
  leadData,
  isUpdatingStatus,
  canModify,
  handleStatusChange,
  PIPELINE_STAGES,
  getCurrentStageIndex,
}: PipelineStepperProps) {
  const currentIndex = getCurrentStageIndex()

  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8">
      <div className="mb-6">
        <span className="text-[9px] uppercase tracking-widest text-olive font-bold block mb-1 font-sans">Workflow Tracker</span>
        <h2 className="text-base font-display font-bold text-ink">Pipeline Stage</h2>
      </div>

      <div className="relative pl-8 space-y-7">
        {/* Stepper Vertical Connector Line */}
        <div className="absolute left-[11px] top-3.5 bottom-3.5 w-[2px] bg-sand/20">
          {/* Active progress track overlay */}
          <div 
            className="w-full bg-olive transition-all duration-500 ease-out" 
            style={{ 
              height: `${(currentIndex / (PIPELINE_STAGES.length - 1)) * 100}%` 
            }}
          />
        </div>

        {PIPELINE_STAGES.map((stage, index) => {
          const isActive = stage === leadData.status
          const isPast = PIPELINE_STAGES.indexOf(stage) < currentIndex

          return (
            <button
              key={stage}
              onClick={() => handleStatusChange(stage)}
              disabled={isUpdatingStatus || !canModify}
              className="group relative flex items-start gap-4 text-left w-full focus:outline-none disabled:cursor-not-allowed"
            >
              {/* Circle Node */}
              <span
                className={`absolute -left-[30px] z-10 flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold font-sans border transition-all duration-300 ${
                  isActive
                    ? 'bg-rust text-cream border-rust shadow-md scale-110 ring-4 ring-rust/10'
                    : isPast
                    ? 'bg-olive text-cream border-olive'
                    : 'bg-cream text-ink/35 border-sand/40 group-hover:border-rust/60 group-hover:text-ink transition-colors'
                }`}
              >
                {isPast ? <FiCheck className="w-3.5 h-3.5" /> : index + 1}
              </span>

              {/* Stage Label (Borderless, clean typography) */}
              <div className="pt-0.5 pb-1 flex-grow">
                <span
                  className={`block text-[11px] uppercase tracking-widest font-semibold transition-colors duration-250 ${
                    isActive 
                      ? 'text-rust font-bold' 
                      : isPast 
                      ? 'text-olive/80 font-medium' 
                      : 'text-ink/50 group-hover:text-ink'
                  }`}
                >
                  {stage.replace(/_/g, ' ')}
                </span>
                <span className={`block text-[9px] font-sans mt-0.5 transition-colors font-light ${
                  isActive ? 'text-rust/60' : 'text-ink/30'
                }`}>
                  {isActive ? 'Current active stage' : isPast ? 'Completed stage' : 'Upcoming stage'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
