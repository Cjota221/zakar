export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sun, BookOpen } from '@phosphor-icons/react/dist/ssr'
import { ShareVerse } from '@/components/biblia/ShareVerse'

interface Props {
  params: Promise<{ id: string }>
}

export default async function DevocionalPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: devotional } = await supabase
    .from('devotionals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!devotional) notFound()

  // Marca como lido
  if (!devotional.read_at) {
    await supabase
      .from('devotionals')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
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
        <Link href="/home" style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <Sun size={14} color="var(--gold)" weight="fill" />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)',
            color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Despertar Zakar
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          {new Date(devotional.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </span>
        {devotional.verse_reference && devotional.verse_text && (
          <ShareVerse
            verseReference={devotional.verse_reference}
            verseText={devotional.verse_text}
          />
        )}
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Versículo */}
        {devotional.verse_reference && (
          <div style={{
            background: 'var(--gold-dim)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <BookOpen size={14} color="var(--gold)" />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)',
                color: 'var(--gold)', letterSpacing: '0.06em',
              }}>
                {devotional.verse_reference}
              </span>
            </div>
            {devotional.verse_text && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-md)',
                fontStyle: 'italic', color: 'var(--text-primary)',
                lineHeight: 1.7,
              }}>
                &ldquo;{devotional.verse_text}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Conteúdo */}
        {devotional.content && (
          <div style={{ marginBottom: '28px' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)',
              color: 'var(--text-secondary)', lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}>
              {devotional.content}
            </p>
          </div>
        )}

        {/* Reflexão */}
        {devotional.reflection_question && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Reflita hoje
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)',
              color: 'var(--text-primary)', lineHeight: 1.6,
            }}>
              {devotional.reflection_question}
            </p>
          </div>
        )}

        {/* Ação do dia */}
        {devotional.action_of_day && (
          <div style={{
            background: 'var(--olive-dim)',
            border: '1px solid rgba(74,93,35,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)',
              color: 'var(--olive-light)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Ação do dia
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)',
              color: 'var(--text-primary)', lineHeight: 1.6,
            }}>
              {devotional.action_of_day}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
