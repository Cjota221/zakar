export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Gear, Trash, Key } from '@phosphor-icons/react/dist/ssr'
import { FontScaleSlider } from '@/components/ui/FontScaleSlider'

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, email, plan, denomination')
    .eq('id', user.id)
    .single()

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gear size={18} color="var(--text-secondary)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Configurações
          </h1>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Conta */}
        <section>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Conta</p>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <InfoRow label="E-mail" value={user.email ?? '—'} />
            <InfoRow label="Plano" value={profile?.plan === 'pro' ? 'Pro ✦' : 'Gratuito'} divider={false} />
          </div>
        </section>

        {/* Leitura */}
        <section>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Leitura</p>
          <FontScaleSlider />
        </section>

        {/* Zona perigosa */}
        <section>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Zona de risco</p>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" style={{
                width: '100%', padding: '14px 16px', background: 'none', border: 'none',
                borderBottom: '1px solid var(--border-default)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
              }}>
                <Key size={18} color="var(--text-muted)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>Sair da conta</span>
              </button>
            </form>
            <button style={{
              width: '100%', padding: '14px 16px', background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
            }}>
              <Trash size={18} color="var(--color-error)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--color-error)' }}>Excluir conta e dados</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function InfoRow({ label, value, divider = true }: { label: string; value: string; divider?: boolean }) {
  return (
    <div style={{
      padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: divider ? '1px solid var(--border-default)' : 'none',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}
