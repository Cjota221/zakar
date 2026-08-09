export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowRight, Lock } from '@phosphor-icons/react/dist/ssr'

export default async function JornadasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: journeys } = await supabase
    .from('journeys')
    .select('*')
    .order('order_index')

  const { data: userProgress } = user
    ? await supabase
        .from('user_journey_progress')
        .select('journey_id, status, current_day')
        .eq('user_id', user.id)
    : { data: [] }

  const progressMap = new Map(
    (userProgress ?? []).map(p => [p.journey_id, p])
  )

  return (
    <div className="page-enter" style={{ padding: '24px 16px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--font-size-xl)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '6px',
      }}>
        Jornadas
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-muted)',
        marginBottom: '24px',
      }}>
        Planos de 7 dias guiados por IA
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(journeys ?? []).map(journey => {
          const progress = progressMap.get(journey.id)
          const isCompleted = progress?.status === 'completed'
          const isActive = progress?.status === 'active'
          const isLocked = journey.is_pro

          return (
            <Link
              key={journey.id}
              href={isLocked ? '#' : `/jornadas/${journey.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card style={{ opacity: isLocked ? 0.7 : 1 }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}>
                    🌿
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {journey.title}
                      </p>
                      {isLocked && <Badge variant="pro">Pro</Badge>}
                      {isCompleted && <Badge variant="completed">Concluído</Badge>}
                      {isActive && <Badge variant="progress">Em progresso</Badge>}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-muted)',
                      marginBottom: isActive ? '8px' : 0,
                    }}>
                      {journey.description ?? `${journey.days_count} dias`}
                    </p>
                    {isActive && (
                      <div style={{ height: '3px', background: 'var(--border-default)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${((progress?.current_day ?? 1) / journey.days_count) * 100}%`,
                          background: 'var(--olive)',
                          borderRadius: '100px',
                        }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                    {isLocked
                      ? <Lock size={16} color="var(--text-muted)" />
                      : <ArrowRight size={16} color="var(--text-muted)" />
                    }
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}

        {(!journeys || journeys.length === 0) && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '32px' }}>
            Nenhuma jornada disponível ainda.
          </p>
        )}
      </div>
    </div>
  )
}
