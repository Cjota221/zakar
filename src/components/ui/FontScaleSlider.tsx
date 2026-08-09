'use client'

import { useFontScale } from '@/lib/contexts/FontScaleContext'

const LEVELS = [0.85, 0.92, 1, 1.1, 1.25]
const LABELS = ['AA', 'A', 'Aa', 'A+', 'A++']

export function FontScaleSlider() {
  const { scaleIndex, setScaleIndex, scaleLabel } = useFontScale()

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      border: '0.5px solid var(--border-default)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}>
          Tamanho da Fonte
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--gold)',
        }}>
          {scaleLabel}
        </span>
      </div>

      {/* Preview */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--font-size-md)',
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        marginBottom: '20px',
        fontStyle: 'italic',
        padding: '12px',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)',
      }}>
        &ldquo;Seja forte e corajoso! Não se apavore nem desanime...&rdquo;
      </div>

      {/* Botões de nível */}
      <div className="flex items-center gap-2" style={{ display: 'flex', gap: '8px' }}>
        {LEVELS.map((_, i) => (
          <button
            key={i}
            onClick={() => setScaleIndex(i)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '8px',
              border: `1px solid ${scaleIndex === i ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
              background: scaleIndex === i ? 'rgba(212,175,55,0.1)' : 'transparent',
              color: scaleIndex === i ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: `${12 + i * 2}px`,
              fontWeight: scaleIndex === i ? 700 : 400,
              transition: 'all 0.15s',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => {
              if (scaleIndex !== i) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={e => {
              if (scaleIndex !== i) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            {LABELS[i]}
          </button>
        ))}
      </div>
    </div>
  )
}