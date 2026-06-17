'use client'

import { Lead, UserProfile } from '@/lib/types'

interface OwnerPanelProps {
  leadData: Lead
  currentUserRole: 'admin' | 'agent'
  isOwner: boolean
  isUnassigned: boolean
  currentUserId?: string
  users: UserProfile[]
  handleOwnerChange: (ownerId: string) => void
}

export default function OwnerPanel({
  leadData,
  currentUserRole,
  isOwner,
  isUnassigned,
  currentUserId,
  users,
  handleOwnerChange,
}: OwnerPanelProps) {
  if (currentUserRole === 'admin') {
    return (
      <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
        <h2 className="text-sm uppercase tracking-wider font-semibold text-ink mb-4 font-sans">Assign Owner</h2>
        <select
          value={leadData.owner_id || ''}
          onChange={(e) => handleOwnerChange(e.target.value)}
          className="w-full px-3 py-2.5 border border-sand/40 rounded-lg focus:ring-2 focus:ring-rust/20 focus:border-rust outline-none bg-cream/10 text-ink text-xs font-sans transition-all cursor-pointer"
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name || user.email}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-sand/30 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
      <h2 className="text-sm uppercase tracking-wider font-semibold text-ink mb-4 font-sans">Lead Owner</h2>
      {isUnassigned ? (
        <div>
          <p className="text-xs text-ink/65 mb-4 font-sans leading-relaxed">
            This lead is currently unassigned. Claim it to log calls and update status.
          </p>
          <button
            onClick={() => handleOwnerChange(currentUserId || '')}
            className="w-full px-4 py-2.5 bg-rust text-cream text-[10px] font-bold tracking-wider uppercase rounded-xl hover:bg-rust/95 active:scale-[0.98] transition-all font-sans shadow-md"
          >
            Claim Lead
          </button>
        </div>
      ) : isOwner ? (
        <div>
          <p className="text-xs text-ink/65 mb-4 font-sans leading-relaxed">
            You own this lead. You can log call details, modify stages, or release assignment.
          </p>
          <button
            onClick={() => handleOwnerChange('')}
            className="w-full px-4 py-2.5 border border-sand/45 text-ink text-[10px] font-bold tracking-wider uppercase rounded-xl hover:bg-cream/55 active:scale-[0.98] transition-all font-sans"
          >
            Release Assignment
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs text-ink/75 font-sans leading-relaxed">
            Assigned to:{' '}
            <strong className="text-ink font-semibold">
              {users.find((u) => u.id === leadData.owner_id)?.full_name ||
                users.find((u) => u.id === leadData.owner_id)?.email ||
                'another agent'}
            </strong>
          </p>
          <p className="text-[10px] text-ink/40 mt-3 font-sans leading-relaxed">
            Only the assigned owner or an administrator can modify this lead.
          </p>
        </div>
      )}
    </div>
  )
}
