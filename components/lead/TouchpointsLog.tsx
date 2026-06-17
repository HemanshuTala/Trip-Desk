'use client'

import { CallLog, UserProfile } from '@/lib/types'
import { Sparkles, Clock, MessageSquare, ArrowRight } from 'lucide-react'

interface TouchpointsLogProps {
  callLogs: CallLog[]
  newNote: string
  nextAction: string
  isAddingNote: boolean
  isSummarizingLogs: boolean
  logSummary: string
  canModify: boolean
  users: UserProfile[]
  setNewNote: (value: string) => void
  setNextAction: (value: string) => void
  handleAddNote: (e: React.FormEvent) => void
  handleSummarizeLogs: () => void
}

export default function TouchpointsLog({
  callLogs,
  newNote,
  nextAction,
  isAddingNote,
  isSummarizingLogs,
  logSummary,
  canModify,
  users,
  setNewNote,
  setNextAction,
  handleAddNote,
  handleSummarizeLogs,
}: TouchpointsLogProps) {
  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-display font-bold text-ink">Touchpoints Log</h2>
      </div>

      {callLogs.length > 0 && (
        <div className="mb-6 bg-cream border border-sand/35 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-ink/50 uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-rust" />
              AI Log Summary
            </span>
            <button
              onClick={handleSummarizeLogs}
              disabled={isSummarizingLogs}
              className="text-[10px] text-rust hover:text-rust/85 font-bold uppercase tracking-wider font-sans"
            >
              {isSummarizingLogs ? 'Summarizing...' : logSummary ? 'Regenerate' : 'Generate Summary'}
            </button>
          </div>
          {logSummary ? (
            <p className="text-xs text-ink/85 italic leading-relaxed font-sans font-light">&quot;{logSummary}&quot;</p>
          ) : (
            <p className="text-[11px] text-ink/40 font-sans font-light">Generate a one-sentence summary of the touchpoint history.</p>
          )}
        </div>
      )}

      {!canModify ? (
        <div className="mb-8 p-4 bg-cream/35 border border-sand/25 rounded-xl text-xs text-ink/60 text-center font-sans">
          Only the owner of this lead or an administrator can record call notes.
        </div>
      ) : (
        <form onSubmit={handleAddNote} className="mb-8 p-4 bg-cream/30 rounded-xl border border-sand/30 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink/80 mb-3 font-sans">Record Touchpoint</h3>
          <div className="space-y-4">
            <div>
              <textarea
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none resize-none bg-white text-xs font-sans placeholder-ink/30 transition-all text-ink"
                placeholder="What did you discuss with the traveller..."
              />
            </div>
            <div>
              <label htmlFor="nextAction" className="block text-[10px] uppercase tracking-wider font-semibold text-ink/65 mb-1.5 font-sans">
                Next Action (optional)
              </label>
              <input
                id="nextAction"
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                className="w-full px-4 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-white text-xs font-sans placeholder-ink/30 transition-all text-ink"
                placeholder="e.g., Send itinerary next Tuesday"
              />
            </div>
            <button
              type="submit"
              disabled={isAddingNote || !newNote.trim()}
              className="px-4 py-2 bg-rust text-cream text-[10px] font-bold tracking-wider uppercase rounded-lg hover:bg-rust/95 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
            >
              {isAddingNote ? 'Recording...' : 'Record Note'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {callLogs.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="w-10 h-10 text-sand/60 mx-auto mb-3" />
            <p className="text-ink/55 text-xs font-sans font-light">No logged touchpoints yet.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4.5 top-2 bottom-2 w-0.5 bg-sand/30"></div>
            {callLogs.map((log) => (
              <div key={log.id} className="relative pl-10 pb-6 last:pb-0">
                <div className="absolute left-3 w-3 h-3 bg-cream border-2 border-rust rounded-full"></div>
                <div className="bg-cream/20 hover:bg-cream/40 border border-sand/25 rounded-xl p-5 shadow-sm transition-all duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-ink/40 flex items-center gap-1.5 font-sans">
                      <Clock className="w-3.5 h-3.5 text-olive/60" />
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {log.created_by && (
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-olive bg-olive/10 border border-olive/20 px-2 py-0.5 rounded-full font-sans">
                        {users.find((u) => u.id === log.created_by)?.full_name ||
                          users.find((u) => u.id === log.created_by)?.email ||
                          'Staff'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/90 leading-relaxed font-sans font-light">{log.notes}</p>
                  {log.next_action && (
                    <div className="mt-4 pt-3 border-t border-sand/20">
                      <p className="text-xs text-ink/65 flex items-center gap-1.5 font-sans font-light">
                        <ArrowRight className="w-3 h-3 text-rust" />
                        <strong>Next Action:</strong> {log.next_action}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
