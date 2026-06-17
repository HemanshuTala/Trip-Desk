'use client'

import { Sparkles } from 'lucide-react'

interface AiAssistantPanelProps {
  aiMessage: string
  isGeneratingMessage: boolean
  showAiMessage: boolean
  canModify: boolean
  handleGenerateAiMessage: () => void
  handleUseAiMessage: () => void
  setShowAiMessage: (value: boolean) => void
  setAiMessage: (value: string) => void
}

export default function AiAssistantPanel({
  aiMessage,
  isGeneratingMessage,
  showAiMessage,
  canModify,
  handleGenerateAiMessage,
  handleUseAiMessage,
  setShowAiMessage,
  setAiMessage,
}: AiAssistantPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
      <h2 className="text-sm uppercase tracking-wider font-semibold text-ink mb-3 flex items-center gap-2 font-sans">
        <Sparkles className="w-4 h-4 text-rust" />
        AI Assistant
      </h2>
      <p className="text-xs text-ink/60 mb-4 leading-relaxed font-sans font-light">
        Draft a short introduction message in the Nomichi editorial voice.
      </p>
      <button
        onClick={handleGenerateAiMessage}
        disabled={isGeneratingMessage || !canModify}
        className="w-full px-4 py-2.5 bg-olive text-cream text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-olive/95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-[0.98] font-sans"
      >
        <Sparkles className="w-3.5 h-3.5 text-sand" />
        {isGeneratingMessage ? 'Drafting...' : 'Draft WhatsApp Message'}
      </button>

      {showAiMessage && (
        <div className="mt-4 p-4 bg-cream/35 rounded-xl border border-sand/30 shadow-inner">
          <p className="text-xs text-ink/90 mb-4 leading-relaxed font-sans font-light italic">&quot;{aiMessage}&quot;</p>
          <div className="flex gap-2.5">
            <button
              onClick={handleUseAiMessage}
              className="px-3.5 py-1.5 bg-rust text-cream text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-rust/95 active:scale-[0.97] transition-all font-sans shadow-sm"
            >
              Use Message
            </button>
            <button
              onClick={() => {
                setShowAiMessage(false)
                setAiMessage('')
              }}
              className="px-3.5 py-1.5 border border-sand/40 text-ink text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-cream/40 transition-all font-sans"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
