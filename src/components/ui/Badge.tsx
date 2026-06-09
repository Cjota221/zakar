import { ReactNode } from 'react'

type BadgeVariant = 'completed' | 'progress' | 'locked' | 'pro' | 'gold'

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  completed: {
    background: '#4A5D23',
    color: '#D4EFB0',
  },
  progress: {
    background: '#D4AF37',
    color: '#3A2E00',
  },
  locked: {
    background: '#1E293B',
    color: '#64748B',
    border: '0.5px solid #334155',
  },
  pro: {
    background: 'var(--gold-dim)',
    color: 'var(--gold)',
    border: '0.5px solid var(--gold-border)',
  },
  gold: {
    background: 'var(--gold-dim)',
    color: 'var(--gold)',
    border: '0.5px solid var(--gold-border)',
  },
}

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  style?: React.CSSProperties
}

export default function Badge({ variant = 'progress', children, style }: BadgeProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: 500,
        borderRadius: 'var(--radius-pill)',
        padding: '4px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
