'use client'

import { useState, useEffect } from 'react'
import { Sun, ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { ShareVerse } from '@/components/biblia/ShareVerse'

interface Devocional {
  id: string
  verse_reference?: string | null
  verse_text?: string | null
  content?: string | null
  reflection_question?: string | null
  action_of_day?: string | null
}

export function DevocionalFallback({ initialDevotional }: { initialDevotional: Devocional | null }) {
  const [devotional, setDevotional] = useState<Devocional | null>(initialDevotional)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (initialDevotional) return
    // Se não tem devocional do dia, tenta gerar via fallback
    queueMicrotask(() => {
      setLoading(true)
      setError(false)
    })

    fetch('/api/despertar/gerar', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.devotional) {
          setDevotional(data.devotional)
        } else if (data.status === 'already_exists') {
          fetch('/api/despertar')
            .then(r => r.json())
            .then(d2 => {
              if (d2.devotional) setDevotional(d2.devotional)
              else setError(true)
            })
            .catch(() => setError(true))
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [initialDevotional])

  if (loading) {
    return (
      <Card
        padding="var(--home-card-padding)"
        style={{ borderColor: 'var(--gold-border)', background: 'var(--bg-card)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sun size={18} color="var(--gold)" weight="fill" />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--home-eyebrow-size)',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Despertar Zakar
          </span>
        </div>
        <div className="skeleton" style={{ height: '11px', width: '30%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '4px' }} />
        <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '4px' }} />
        <div className="skeleton" style={{ height: '13px', width: '90%', marginBottom: '4px' }} />
        <div className="skeleton" style={{ height: '13px', width: '60%', marginBottom: '16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="skeleton" style={{ height: '12px', width: '25%' }} />
          <div className="skeleton" style={{ height: '12px', width: '20%' }} />
        </div>
      </Card>
    )
  }

  if (error && !devotional) {
    return (
      <div style={{ margin: '0 var(--home-page-x) var(--home-section-gap)' }}>
        <Card
          padding="var(--home-card-padding)"
          style={{ borderColor: 'var(--gold-border)', background: 'var(--bg-card)', textAlign: 'center' }}
        >
          <Sun size={24} color="var(--gold)" weight="fill" style={{ marginBottom: 12 }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
            O Devocional de hoje ainda não está disponível.
          </p>
          <button
            onClick={() => {
              setError(false)
              setLoading(true)
              fetch('/api/despertar/gerar', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                  if (data.devotional) setDevotional(data.devotional)
                  else setError(true)
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false))
            }}
            style={{
              background: 'var(--gold)', color: '#0F172A',
              fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-sm)', fontWeight: 700,
              border: 'none', borderRadius: 12, padding: '10px 20px', cursor: 'pointer',
            }}
          >
            Tentar novamente
          </button>
        </Card>
      </div>
    )
  }

  if (!devotional) return null

  return (
    <Card
      padding="var(--home-card-padding)"
      style={{
        borderColor: 'var(--gold-border)',
        background: 'var(--bg-card)',
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Sun size={18} color="var(--gold)" weight="fill" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--home-eyebrow-size)',
          color: 'var(--gold)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Despertar Zakar
        </span>
      </div>

      {/* Versículo */}
      {devotional.verse_reference && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--home-verse-ref-size)',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          {devotional.verse_reference}
        </p>
      )}
      {devotional.verse_text && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--home-verse-size)',
          fontStyle: 'italic',
          color: '#CBD5E1',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          &ldquo;{devotional.verse_text}&rdquo;
        </p>
      )}

      {/* Palavra gerada */}
      {devotional.content && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--home-body-size)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: '20px',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {devotional.content}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {devotional.id && (
          <Link
            href={`/home/devocional/${devotional.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--home-link-size)',
              fontWeight: 600,
              color: 'var(--gold)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'none',
            }}
          >
            Ler completo <ArrowRight size={14} />
          </Link>
        )}
        {devotional.verse_reference && devotional.verse_text && (
          <ShareVerse
            verseReference={devotional.verse_reference}
            verseText={devotional.verse_text}
          />
        )}
      </div>
    </Card>
  )
}