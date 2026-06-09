'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bell } from '@phosphor-icons/react'

export default function NotificacoesPage() {
  const [despertar, setDespertar] = useState(true)
  const [streakLembrete, setStreakLembrete] = useState(true)
  const [jornadaLembrete, setJornadaLembrete] = useState(false)
  const [hora, setHora] = useState('07:00')

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
          <Bell size={18} color="var(--text-secondary)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Notificações
          </h1>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Horário do Despertar */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)', padding: '16px',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Horário do Despertar
          </p>
          <input
            type="time"
            value={hora}
            onChange={e => setHora(e.target.value)}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-md)',
              color: 'var(--gold)', width: '100%', outline: 'none',
            }}
          />
        </div>

        <ToggleRow label="Despertar Zakar" sub="Palavra diária no horário escolhido" value={despertar} onChange={setDespertar} />
        <ToggleRow label="Lembrete de streak" sub="Aviso quando está prestes a perder a sequência" value={streakLembrete} onChange={setStreakLembrete} />
        <ToggleRow label="Progresso da jornada" sub="Lembrete diário para continuar a jornada ativa" value={jornadaLembrete} onChange={setJornadaLembrete} />

        <button style={{
          marginTop: '8px', padding: '14px',
          background: 'var(--gold)', color: '#0F172A',
          border: 'none', borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-sm)', fontWeight: 700,
          cursor: 'pointer',
        }}>
          Salvar preferências
        </button>
      </div>
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)', padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
    }}>
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{sub}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '44px', height: '26px', borderRadius: '100px', flexShrink: 0,
          background: value ? 'var(--gold)' : 'var(--border-medium)',
          border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: value ? '21px' : '3px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}
