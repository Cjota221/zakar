export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sun, ArrowRight, BookmarkSimple } from '@phosphor-icons/react/dist/ssr'
import StreakBadge from '@/components/gamification/StreakBadge'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import { Greeting } from '@/components/ui/Greeting'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { ShareVerse } from '@/components/biblia/ShareVerse'
import { EraCards } from '@/components/study/EraCards'
import { DailyPsalmCard } from '@/components/home/DailyPsalmCard'

type JourneyProgressWithJourney = {
  journeys?: {
    title?: string | null
  } | null
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, devotionalResult, progressResult] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('name, streak_current, xp, level, avatar_url')
      .eq('id', user.id)
      .single(),
    supabase
      .from('devotionals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle(),
    supabase
      .from('user_journey_progress')
      .select('*, journeys(title, theme)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle(),
  ])

  const profile = profileResult.data
  const devotional = devotionalResult.data
  const activeJourney = progressResult.data
  const activeJourneyDetails = activeJourney as JourneyProgressWithJourney | null

  if (!profile) redirect('/onboarding')

  const levelNames: Record<number, string> = {
    1: 'Semente',
    2: 'Raiz',
    3: 'Broto',
    4: 'Árvore',
    5: 'Cedro',
    6: 'Ancião',
    7: 'Guardião',
  }

  return (
    <div className="page-enter home-page" style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: 'var(--home-header-padding)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Greeting name={profile.name ?? ''} />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--home-title-size)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.12,
          }}>
            Sua palavra de hoje
          </h1>
        </div>
        <Link href="/perfil" style={{ textDecoration: 'none', marginTop: '4px', flexShrink: 0 }}>
          <UserAvatar avatarUrl={profile.avatar_url} name={profile.name} size="var(--home-avatar-size)" />
        </Link>
      </div>

      {/* Streak + XP */}
      <div style={{
        padding: '0 var(--home-page-x) var(--home-section-gap)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <StreakBadge days={profile.streak_current} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--home-meta-size)',
          color: 'var(--text-muted)',
        }}>
          {profile.xp} XP · {levelNames[profile.level] ?? 'Semente'}
        </span>
      </div>

      {/* Despertar Zakar Card */}
      <div style={{ margin: '0 var(--home-page-x) var(--home-section-gap)' }}>
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

          {devotional ? (
            <>
              {/* Versículo */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--home-verse-ref-size)',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}>
                {devotional.verse_reference}
              </p>
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

              {/* Palavra gerada */}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
                {devotional.verse_reference && devotional.verse_text && (
                  <ShareVerse
                    verseReference={devotional.verse_reference}
                    verseText={devotional.verse_text}
                  />
                )}
              </div>
            </>
          ) : (
            <DevocionalSkeleton />
          )}
        </Card>
      </div>

      {/* Salmo do Dia */}
      <DailyPsalmCard />

      {/* Estude a Bíblia — eras históricas */}
      <div style={{ marginBottom: 'var(--home-section-gap)' }}>
        <EraCards />
      </div>

      {/* Jornada ativa */}
      {activeJourney && (
        <div style={{ padding: '0 var(--home-page-x)' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--home-section-title-size)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Sua jornada ativa
          </p>
          <Link
            href={`/jornadas/${activeJourney.journey_id}`}
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <Card padding="var(--home-compact-card-padding)">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 'var(--home-journey-icon-size)',
                  height: 'var(--home-journey-icon-size)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--olive-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--home-journey-emoji-size)',
                  flexShrink: 0,
                }}>
                  🌿
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--home-journey-title-size)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {activeJourneyDetails?.journeys?.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--home-meta-size)',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                  }}>
                    Dia {activeJourney.current_day} de 7
                  </p>
                  {/* Progress bar */}
                  <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(activeJourney.current_day / 7) * 100}%`,
                      background: 'var(--olive)',
                      borderRadius: '100px',
                    }} />
                  </div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* CTA sem jornada */}
      {!activeJourney && (
        <div style={{ padding: '0 var(--home-page-x)' }}>
          <Link
            href="/jornadas"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--home-compact-card-padding)',
              background: 'var(--gold-dim)',
              border: '1px solid var(--gold-border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <BookmarkSimple size={24} color="var(--gold)" />
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--home-journey-title-size)', fontWeight: 600, color: 'var(--gold)' }}>
                  Escolher uma jornada
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--home-meta-size)', color: 'var(--text-muted)' }}>
                  Planos de 7 dias com guia da IA
                </p>
              </div>
            </div>
            <ArrowRight size={16} color="var(--gold)" />
          </Link>
        </div>
      )}
    </div>
  )
}

function DevocionalSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: '11px', width: '30%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '4px' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '4px' }} />
      <div className="skeleton" style={{ height: '13px', width: '90%', marginBottom: '4px' }} />
      <div className="skeleton" style={{ height: '13px', width: '60%', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '12px', width: '25%' }} />
    </div>
  )
}
