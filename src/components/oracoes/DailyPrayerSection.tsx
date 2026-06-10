'use client'

import { useState } from 'react'
import { HandsPraying, ArrowCounterClockwise } from '@phosphor-icons/react'

interface Prayer {
  prayer: string
  verse_reference?: string | null
  verse_text?: string | null
}

interface Props {
  initialPrayer: Prayer | null
}

export function DailyPrayerSection({ initialPrayer }: Props) {
  const [prayer, setPrayer] = useState<Prayer | null>(initialPrayer)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/oracao', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setPrayer(data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '0 16px 16px' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--gold-border)',
        borderRadius: 16,
        padding: 18,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HandsPraying size={16} color="var(--gold)" weight="fill" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Oração do Dia
            </span>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: '1px solid var(--border-default)', borderRadius: 8,
              padding: '4px 8px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <ArrowCounterClockwise size={12} />
            {loading ? 'Gerando...' : 'Nova oração'}
          </button>
        </div>

        {prayer ? (
          <>
            {prayer.verse_reference && (
              <div style={{ marginBottom: 14, padding: '10px 12px', background: 'rgba(212,175,55,0.07)', borderRadius: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 4 }}>
                  {prayer.verse_reference}
                </div>
                {prayer.verse_text && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    &ldquo;{prayer.verse_text}&rdquo;
                  </p>
                )}
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {prayer.prayer}
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              Sua oração personalizada para hoje ainda não foi gerada.
            </p>
            <button
              onClick={generate}
              disabled={loading}
              style={{
                background: 'var(--gold)', color: '#0F172A',
                fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
                border: 'none', borderRadius: 12, padding: '11px 20px',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Gerando...' : 'Gerar oração do dia'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
