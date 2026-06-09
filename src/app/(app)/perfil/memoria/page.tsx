export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Brain } from '@phosphor-icons/react/dist/ssr'

export default async function MemoriaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: fragments } = await supabase
    .from('memory_fragments')
    .select('id, content, type, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const typeLabel: Record<string, string> = {
    conversa: 'Conversa',
    contexto_vida: 'Contexto de vida',
    favorito: 'Versículo favorito',
    reflexao: 'Reflexão',
  }

  return (
    <div className="page-enter" style={{ paddingBottom: '80px' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <Link href="/perfil" style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <Brain size={18} color="var(--gold)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Minha Memória
          </h1>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          Tudo que o Zakar aprendeu sobre você. Esses fragmentos dão contexto personalizado às respostas dos agentes.
        </p>

        {(!fragments || fragments.length === 0) ? (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
          }}>
            <Brain size={32} color="var(--border-default)" style={{ marginBottom: '12px' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
              Nenhuma memória ainda. Converse com os agentes para construir seu perfil.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fragments.map(f => (
              <div key={f.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)',
                    color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {typeLabel[f.type] ?? f.type}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    {new Date(f.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
