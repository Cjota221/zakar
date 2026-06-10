import Link from 'next/link'
import { MusicNotes, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { getDailyPsalmNumber } from '@/lib/daily-content'

export function DailyPsalmCard() {
  const psalmNum = getDailyPsalmNumber()

  return (
    <div style={{ margin: '0 var(--home-page-x) var(--home-section-gap)' }}>
      <Link
        href={`/biblia/sl/${psalmNum}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px',
          background: 'rgba(212,175,55,0.07)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 14, textDecoration: 'none',
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(212,175,55,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MusicNotes size={18} color="var(--gold)" weight="fill" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            Salmo do Dia
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Salmo {psalmNum}
          </div>
        </div>
        <ArrowRight size={16} color="var(--gold)" />
      </Link>
    </div>
  )
}
