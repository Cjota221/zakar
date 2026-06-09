export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOut, Brain, Bell, Gear } from '@phosphor-icons/react/dist/ssr'
import StreakBadge from '@/components/gamification/StreakBadge'
import Card from '@/components/ui/Card'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const levelNames: Record<number, string> = {
    1: 'Semente', 2: 'Raiz', 3: 'Broto',
    4: 'Árvore', 5: 'Cedro', 6: 'Ancião', 7: 'Guardião',
  }

  const lifeStageLabels: Record<string, string> = {
    restarting: 'Em recomeço',
    purpose: 'Buscando propósito',
    growing: 'Crescendo na fé',
    struggling: 'Passando por dificuldades',
    stable: 'Estável e grato',
  }

  return (
    <div className="page-enter" style={{ padding: '24px 16px' }}>
      {/* Avatar + nome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--gold-dim)',
          border: '1.5px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--gold)' }}>
            {profile.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            {profile.name}
          </h1>
          {profile.life_stage && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
              {lifeStageLabels[profile.life_stage]}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
        <StatCard label="Streak" value={<StreakBadge days={profile.streak_current} />} />
        <StatCard
          label="XP"
          value={
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--gold)' }}>
              {profile.xp}
            </span>
          }
        />
        <StatCard
          label="Nível"
          value={
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {levelNames[profile.level]}
            </span>
          }
        />
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <MenuRow
          icon={<Brain size={20} color="var(--gold)" />}
          label="Minha Memória"
          sub="Veja o que o Zakar sabe sobre você"
          href="/perfil/memoria"
        />
        <MenuRow
          icon={<Bell size={20} color="var(--text-secondary)" />}
          label="Notificações"
          sub="Horário do Despertar e lembretes"
          href="/perfil/notificacoes"
        />
        <MenuRow
          icon={<Gear size={20} color="var(--text-secondary)" />}
          label="Configurações"
          sub="Conta, tema, privacidade"
          href="/perfil/configuracoes"
        />

        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 0',
              background: 'none',
              border: 'none',
              borderTop: '0.5px solid var(--border-default)',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            <SignOut size={20} color="var(--color-error)" />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-error)',
            }}>
              Sair da conta
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card padding="12px" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '6px' }}>{value}</div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>
        {label}
      </p>
    </Card>
  )
}

function MenuRow({
  icon,
  label,
  sub,
  href,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  href: string
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 0',
        borderBottom: '0.5px solid var(--border-default)',
        textDecoration: 'none',
      }}
    >
      {icon}
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
          {label}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
          {sub}
        </p>
      </div>
    </a>
  )
}
