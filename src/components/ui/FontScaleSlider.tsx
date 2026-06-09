'use client'

import { useFontScale } from '@/lib/contexts/FontScaleContext'

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
          Tamanho do texto
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
        "Seja forte e corajoso! Não se apavore nem desanime..."
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={scaleIndex}
        onChange={e => setScaleIndex(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--gold)',
          height: '4px',
          cursor: 'pointer',
          display: 'block',
        }}
      />

      {/* A crescente clicável */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        {[11, 13, 15, 18, 21].map((size, i) => (
          <button
            key={i}
            onClick={() => setScaleIndex(i)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: `${size}px`,
              fontWeight: scaleIndex === i ? 700 : 400,
              color: scaleIndex === i ? 'var(--gold)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'color 0.15s',
              background: 'none',
              border: 'none',
              padding: '4px 8px',
            }}
          >
            A
          </button>
        ))}
      </div>
    </div>
  )
}
