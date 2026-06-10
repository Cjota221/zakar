import Link from 'next/link'
import { BookOpen, ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface Props {
  type: 'psalm' | 'proverb'
  number: number
  label: string
  badge: string
  href: string
}

const COLORS = {
  psalm: { accent: '#D4AF37', bg: 'rgba(212,175,55,0.07)', border: 'rgba(212,175,55,0.2)' },
  proverb: { accent: '#4A5D23', bg: 'rgba(74,93,35,0.08)', border: 'rgba(74,93,35,0.25)' },
}

export function DailyScriptureCard({ type, number, label, badge, href }: Props) {
  const c = COLORS[type]

  return (
    <div style={{ margin: '0 16px 16px' }}>
      <Link
        href={href}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px',
          background: c.bg, border: `1px solid ${c.border}`,
          borderRadius: 16, textDecoration: 'none',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: c.accent + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BookOpen size={20} color={c.accent} weight="fill" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
            {badge}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>
            Toque para ler
          </div>
        </div>
        <ArrowRight size={18} color={c.accent} />
      </Link>
    </div>
  )
}
