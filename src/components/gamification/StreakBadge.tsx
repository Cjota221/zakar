import { Fire } from '@phosphor-icons/react/dist/ssr'

interface StreakBadgeProps {
  days: number
}

export default function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: 'var(--gold-dim)',
        border: '0.5px solid var(--gold-border)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px 10px',
      }}
    >
      <Fire size={14} color="var(--gold)" weight="fill" />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--gold)',
        }}
      >
        {days} {days === 1 ? 'dia' : 'dias'}
      </span>
    </div>
  )
}
