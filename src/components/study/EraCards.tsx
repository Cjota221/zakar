'use client'

import { useRouter } from 'next/navigation'
import { ERAS_CONTENT } from '@/lib/bible/eras-content'

export function EraCards() {
  const router = useRouter()

  return (
    <div style={{ paddingBottom: 4 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 16px', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            Estude a Bíblia
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' }}>
            Teologia profunda por eras históricas
          </div>
        </div>
      </div>

      {/* Cards horizontais */}
      <div style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        padding: '0 16px 4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {ERAS_CONTENT.map(era => (
          <button
            key={era.id}
            onClick={() => router.push(`/estudo/${era.id}`)}
            style={{
              flexShrink: 0,
              width: 188,
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 16,
              padding: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = era.color + '60')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          >
            {/* Ícone + período */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: era.color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                color: era.color,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {era.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', textAlign: 'right', maxWidth: 90, lineHeight: 1.4 }}>
                {era.period}
              </div>
            </div>

            {/* Título + subtitle */}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, lineHeight: 1.3 }}>
              {era.title}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: era.color, marginBottom: 6 }}>
              {era.subtitle}
            </div>

            {/* Descrição truncada */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {era.coverDescription}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${era.color}20`, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: era.color }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: era.color }}>
                {era.mainTopics.length} tópicos · {era.keyVerses.length} versículos
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
