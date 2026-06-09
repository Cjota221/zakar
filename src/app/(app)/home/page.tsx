import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sun, ArrowRight, BookmarkSimple } from '@phosphor-icons/react/dist/ssr'
import StreakBadge from '@/components/gamification/StreakBadge'
import Card from '@/components/ui/Card'
import Link from 'next/link'

function getGreeting(hour: number): string {
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, devotionalResult, progressResult] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('name, streak_current, xp, level')
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

  if (!profile) redirect('/onboarding')

  const hour = new Date().getHours()
  const greeting = getGreeting(hour)

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
    <div className="page-enter" style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '4px',
        }}>
          {greeting}, {profile.name}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
        }}>
          Sua palavra de hoje
        </h1>
      </div>

      {/* Streak + XP */}
      <div style={{
        padding: '0 16px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <StreakBadge days={profile.streak_current} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          {profile.xp} XP · {levelNames[profile.level] ?? 'Semente'}
        </span>
      </div>

      {/* Despertar Zakar Card */}
      <div style={{ margin: '0 16px 12px' }}>
        <Card
          style={{
            borderColor: 'var(--gold-border)',
            background: 'var(--bg-card)',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sun size={14} color="var(--gold)" weight="fill" />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
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
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}>
                {devotional.verse_reference}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontStyle: 'italic',
                color: '#CBD5E1',
                lineHeight: 1.6,
                marginBottom: '12px',
              }}>
                &ldquo;{devotional.verse_text}&rdquo;
              </p>

              {/* Palavra gerada */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {devotional.content}
              </p>

              <Link
                href={`/home/devocional/${devotional.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
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
            </>
          ) : (
            <DevocionalSkeleton />
          )}
        </Card>
      </div>

      {/* Jornada ativa */}
      {activeJourney && (
        <div style={{ padding: '0 16px' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '10px',
          }}>
            Sua jornada ativa
          </p>
          <Link
            href={`/jornadas/${activeJourney.journey_id}`}
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <Card padding="12px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--olive-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}>
                  🌿
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {(activeJourney as any).journeys?.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    marginBottom: '6px',
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
        <div style={{ padding: '0 16px' }}>
          <Link
            href="/jornadas"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'var(--gold-dim)',
              border: '1px solid var(--gold-border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookmarkSimple size={20} color="var(--gold)" />
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--gold)' }}>
                  Escolher uma jornada
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
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
