export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Circle, Lock } from '@phosphor-icons/react/dist/ssr'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Props {
  params: Promise<{ id: string }>
}

export default async function JornadaDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [journeyRes, daysRes, progressRes] = await Promise.all([
    supabase.from('journeys').select('*').eq('id', id).single(),
    supabase.from('journey_days').select('*').eq('journey_id', id).order('day_number'),
    supabase.from('user_journey_progress')
      .select('*').eq('user_id', user.id).eq('journey_id', id).maybeSingle(),
  ])

  if (!journeyRes.data) notFound()

  const journey = journeyRes.data
  const days = daysRes.data ?? []
  const progress = progressRes.data

  async function startJourney() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('user_journey_progress').upsert({
      user_id: user.id,
      journey_id: id,
      current_day: 1,
      status: 'active',
    }, { onConflict: 'user_id,journey_id' })
    redirect(`/jornadas/${id}`)
  }

  const currentDay = progress?.current_day ?? 0
  const isActive = progress?.status === 'active'
  const isCompleted = progress?.status === 'completed'

  const difficultyLabel: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  }

  return (
    <div className="page-enter" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <Link href="/jornadas" style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)',
          fontWeight: 700, color: 'var(--text-primary)', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {journey.title}
        </h1>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Info da jornada */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <Badge variant={journey.is_pro ? 'pro' : 'progress'}>
              {journey.is_pro ? 'Pro' : 'Grátis'}
            </Badge>
            <Badge variant="completed">{difficultyLabel[journey.difficulty] ?? journey.difficulty}</Badge>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {journey.days_count} dias
            </span>
          </div>

          {journey.description && (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)', lineHeight: 1.7,
            }}>
              {journey.description}
            </p>
          )}
        </div>

        {/* Barra de progresso */}
        {isActive && (
          <Card style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '8px' }}>
              SEU PROGRESSO
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                Dia {currentDay} de {journey.days_count}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--gold)' }}>
                {Math.round((currentDay / journey.days_count) * 100)}%
              </span>
            </div>
            <div style={{ height: '4px', background: 'var(--border-default)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(currentDay / journey.days_count) * 100}%`,
                background: 'var(--olive)',
                borderRadius: '100px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </Card>
        )}

        {/* Botão iniciar/continuar */}
        {!isCompleted && (
          <form action={startJourney}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: journey.is_pro ? 'var(--border-default)' : 'var(--gold)',
                color: journey.is_pro ? 'var(--text-muted)' : '#0F172A',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 700,
                cursor: journey.is_pro ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
              disabled={journey.is_pro}
            >
              {journey.is_pro ? (
                <><Lock size={16} /> Disponível no plano Pro</>
              ) : isActive ? (
                <>Continuar — Dia {currentDay} <ArrowRight size={16} /></>
              ) : (
                <>Começar jornada <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        )}

        {/* Lista de dias */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '12px',
        }}>
          {days.length > 0 ? 'Conteúdo da jornada' : 'Dias em breve'}
        </p>

        {days.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {days.map(day => {
              const done = isActive && day.day_number < currentDay
              const current = isActive && day.day_number === currentDay
              const locked = !isActive || day.day_number > currentDay

              return (
                <div
                  key={day.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px',
                    background: current ? 'var(--gold-dim)' : 'var(--bg-card)',
                    border: `1px solid ${current ? 'var(--gold-border)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  {done ? (
                    <CheckCircle size={20} color="var(--olive-light)" weight="fill" />
                  ) : current ? (
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'var(--gold)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: '#0F172A' }}>
                        {day.day_number}
                      </span>
                    </div>
                  ) : (
                    <Circle size={20} color="var(--border-default)" />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-sm)',
                      fontWeight: current ? 600 : 400,
                      color: current ? 'var(--gold)' : 'var(--text-primary)',
                    }}>
                      Dia {day.day_number}{day.title ? ` — ${day.title}` : ''}
                    </p>
                    {day.book_abbreviation && (
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {day.book_abbreviation} {day.chapter_start}
                        {day.verse_start ? `:${day.verse_start}` : ''}
                        {day.chapter_end && day.chapter_end !== day.chapter_start ? `–${day.chapter_end}` : ''}
                      </p>
                    )}
                  </div>
                  {current && <ArrowRight size={16} color="var(--gold)" />}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{
            padding: '32px 16px', textAlign: 'center',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
              O conteúdo detalhado dos dias será adicionado em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
