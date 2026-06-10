'use client'

import { useState } from 'react'
import { BIBLE_TIMELINE, type BibleEra } from '@/lib/bible/timeline'

interface BibleTimelineProps {
  currentBook?: string
}

export function BibleTimeline({ currentBook }: BibleTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const currentEra = currentBook
    ? BIBLE_TIMELINE.find(era => era.books.includes(currentBook.toLowerCase()))
    : null

  function toggle(id: string) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 4,
        }}>
          Linha do Tempo Cronológica
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>
          A Bíblia na História
        </div>

        {currentEra && (
          <div style={{
            marginTop: 10,
            padding: '10px 12px',
            background: 'rgba(212,175,55,0.07)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 10,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#D4AF37', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Você está lendo
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentEra.era}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              {currentEra.period}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 9,
          top: 10,
          bottom: 10,
          width: 2,
          background: 'var(--border-default)',
          borderRadius: 2,
        }} />

        {BIBLE_TIMELINE.map((era, index) => {
          const isActive = currentEra?.id === era.id
          const isExpanded = expandedId === era.id
          const isEmpty = era.books.length === 0

          return (
            <EraRow
              key={era.id}
              era={era}
              isActive={isActive}
              isExpanded={isExpanded}
              isEmpty={isEmpty}
              isLast={index === BIBLE_TIMELINE.length - 1}
              onToggle={() => toggle(era.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function EraRow({
  era,
  isActive,
  isExpanded,
  isEmpty,
  isLast,
  onToggle,
}: {
  era: BibleEra
  isActive: boolean
  isExpanded: boolean
  isEmpty: boolean
  isLast: boolean
  onToggle: () => void
}) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: isLast ? 0 : 16, opacity: isEmpty ? 0.55 : 1 }}>
      {/* Dot */}
      <div style={{ flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center', paddingTop: 14 }}>
        <div style={{
          width: isActive ? 18 : 10,
          height: isActive ? 18 : 10,
          borderRadius: '50%',
          background: isActive ? era.color : 'var(--bg-secondary)',
          border: `2px solid ${era.color}`,
          transition: 'all 0.2s ease',
          boxShadow: isActive ? `0 0 10px ${era.color}60` : 'none',
          flexShrink: 0,
        }} />
      </div>

      {/* Card */}
      <div
        onClick={onToggle}
        style={{
          flex: 1,
          background: isActive ? `${era.color}0D` : 'var(--bg-card)',
          border: `1px solid ${isActive ? `${era.color}40` : 'var(--border-default)'}`,
          borderRadius: 10,
          padding: '12px 14px',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
      >
        {/* Era title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? era.color : 'var(--text-primary)',
              marginBottom: 2,
            }}>
              {era.era}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: isActive ? era.color : 'var(--text-muted)',
              opacity: isActive ? 0.85 : 1,
            }}>
              {era.period}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
            transition: 'transform 0.2s ease',
            transform: isExpanded ? 'rotate(90deg)' : 'none',
            flexShrink: 0,
          }}>
            ›
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div style={{ marginTop: 10, borderTop: '1px solid var(--border-default)', paddingTop: 10 }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 10,
            }}>
              {era.description}
            </p>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              Eventos principais
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {era.events.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: era.color,
                    flexShrink: 0,
                    minWidth: 76,
                    paddingTop: 1,
                  }}>
                    {ev.year}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                  }}>
                    {ev.event}
                  </div>
                </div>
              ))}
            </div>

            {isEmpty && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                marginTop: 8,
              }}>
                Sem livros canônicos neste período
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
