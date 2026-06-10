export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { CompleteDayButton } from '@/components/jornadas/CompleteDayButton'

interface Props {
  params: Promise<{ id: string; dia: string }>
}

export default async function JornadaDiaPage({ params }: Props) {
  const { id, dia } = await params
  const dayNumber = Number(dia)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [journeyRes, dayRes, progressRes] = await Promise.all([
    supabase.from('journeys').select('title, days_count').eq('id', id).single(),
    supabase.from('journey_days').select('*').eq('journey_id', id).eq('day_number', dayNumber).maybeSingle(),
    supabase.from('user_journey_progress').select('*').eq('user_id', user.id).eq('journey_id', id).maybeSingle(),
  ])

  if (!journeyRes.data) notFound()

  const journey = journeyRes.data
  const day = dayRes.data
  const progress = progressRes.data

  // Só permite acesso ao dia atual ou anteriores
  const currentDay = progress?.current_day ?? 1
  if (dayNumber > currentDay) redirect(`/jornadas/${id}`)

  const isDone = dayNumber < currentDay
  const isLast = dayNumber === journey.days_count

  return (
    <div className="page-enter" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Link href={`/jornadas/${id}`} style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {journey.title}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Dia {dayNumber} de {journey.days_count}
          </div>
        </div>
        {isDone && <CheckCircle size={20} color="var(--olive-light)" weight="fill" />}
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Barra de progresso */}
        <div>
          <div style={{ height: 4, background: 'var(--border-default)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(dayNumber / journey.days_count) * 100}%`,
              background: isDone ? 'var(--olive)' : 'var(--gold)',
              borderRadius: 100,
            }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            {Math.round((dayNumber / journey.days_count) * 100)}% concluído
          </div>
        </div>

        {day ? (
          <>
            {/* Título do dia */}
            {day.title && (
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {day.title}
              </h2>
            )}

            {/* Passagem do dia */}
            {day.book_abbreviation && (
              <Link
                href={`/biblia/${day.book_abbreviation}/${day.chapter_start}${day.verse_start ? `?versiculo=${day.verse_start}&highlight=true` : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                  borderRadius: 14, textDecoration: 'none',
                }}
              >
                <BookOpen size={20} color="var(--gold)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                    Leitura de hoje
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {day.book_abbreviation.toUpperCase()} {day.chapter_start}
                    {day.verse_start ? `:${day.verse_start}` : ''}
                    {day.chapter_end && day.chapter_end !== day.chapter_start ? `–${day.chapter_end}` : ''}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>›</div>
              </Link>
            )}

            {/* Conteúdo / reflexão */}
            {day.reflection && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Reflexão
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                  {day.reflection}
                </p>
              </div>
            )}

            {/* Pergunta de reflexão */}
            {day.reflection_question && (
              <div style={{
                padding: 16, background: 'var(--bg-card)',
                border: '1px solid var(--border-default)', borderRadius: 14,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Reflita hoje
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', lineHeight: 1.65 }}>
                  {day.reflection_question}
                </p>
              </div>
            )}

            {/* Ação do dia */}
            {day.action_of_day && (
              <div style={{
                padding: 16, background: 'var(--olive-dim)',
                border: '1px solid rgba(74,93,35,0.3)', borderRadius: 14,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--olive-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Ação do dia
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', lineHeight: 1.65 }}>
                  {day.action_of_day}
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border-default)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
              O conteúdo deste dia ainda está sendo preparado.
            </p>
          </div>
        )}

        {/* Botão Concluir */}
        {!isDone && (
          <CompleteDayButton
            journeyId={id}
            dayNumber={dayNumber}
            isLast={isLast}
          />
        )}

        {isDone && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
            padding: 14, background: 'rgba(74,93,35,0.1)', borderRadius: 14,
          }}>
            <CheckCircle size={18} color="var(--olive-light)" weight="fill" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--olive-light)' }}>
              Dia concluído!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
