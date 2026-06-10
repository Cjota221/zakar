'use client'

import { useRouter } from 'next/navigation'
import { ERAS_CONTENT } from '@/lib/bible/eras-content'

export function EraCards() {
  const router = useRouter()

  return (
    <div style={{ paddingBottom: 4 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 var(--home-page-x, 16px)', marginBottom: 'var(--home-era-header-gap, 14px)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--home-era-heading-size, 15px)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Estude a Bíblia
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--home-meta-size, 11px)', color: 'var(--text-muted)' }}>
            Teologia profunda por eras históricas
          </div>
        </div>
      </div>

      {/* Cards horizontais */}
      <div style={{
        display: 'flex',
        gap: 'var(--home-era-gap, 12px)',
        overflowX: 'auto',
        padding: '0 var(--home-page-x, 16px) 4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {ERAS_CONTENT.map(era => (
          <button
            key={era.id}
            onClick={() => router.push(`/estudo/${era.id}`)}
            style={{
              flexShrink: 0,
              width: 'var(--home-era-card-width, 188px)',
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border-default)',
              borderRadius: 16,
              padding: 'var(--home-era-card-padding, 14px)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = era.color + '60')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          >
            {/* Ícone + período */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{
                width: 'var(--home-era-icon-size, 34px)',
                height: 'var(--home-era-icon-size, 34px)',
                borderRadius: 9,
                background: era.color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--home-era-icon-font-size, 15px)',
                color: era.color,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {era.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--home-era-period-size, 8px)', color: 'var(--text-muted)', textAlign: 'right', maxWidth: 'var(--home-era-period-width, 90px)', lineHeight: 1.4 }}>
                {era.period}
              </div>
            </div>

            {/* Título + subtitle */}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--home-era-title-size, 12px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
              {era.title}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--home-era-subtitle-size, 10px)', color: era.color, marginBottom: 8 }}>
              {era.subtitle}
            </div>

            {/* Descrição truncada */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--home-era-body-size, 10px)',
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
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${era.color}20`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: era.color }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--home-era-footer-size, 9px)', color: era.color }}>
                {era.mainTopics.length} tópicos · {era.keyVerses.length} versículos
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
