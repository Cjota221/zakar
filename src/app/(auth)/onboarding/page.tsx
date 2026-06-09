'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react'

type LifeStage = 'restarting' | 'purpose' | 'growing' | 'struggling' | 'stable'
type Frequency  = 'daily' | 'some_days' | 'weekends'
type Familiarity = 'beginner' | 'casual' | 'regular' | 'advanced'

interface OnboardingData {
  name: string
  life_stage: LifeStage | ''
  reading_frequency: Frequency | ''
  bible_familiarity: Familiarity | ''
  preferred_hour: string
}

const lifeStageOptions: { value: LifeStage; label: string; emoji: string }[] = [
  { value: 'restarting',  label: 'Em recomeço',          emoji: '🌱' },
  { value: 'purpose',     label: 'Buscando propósito',   emoji: '🧭' },
  { value: 'growing',     label: 'Crescendo na fé',      emoji: '🌿' },
  { value: 'struggling',  label: 'Passando por dificuldades', emoji: '🌧️' },
  { value: 'stable',      label: 'Estável e grato',      emoji: '☀️' },
]

const frequencyOptions: { value: Frequency; label: string; sub: string }[] = [
  { value: 'daily',      label: 'Todos os dias',   sub: 'Quero criar um hábito diário' },
  { value: 'some_days',  label: 'Alguns dias',     sub: 'De 3 a 5 vezes por semana' },
  { value: 'weekends',   label: 'Fim de semana',   sub: 'Mais tranquilo, sem pressão' },
]

const familiarityOptions: { value: Familiarity; label: string; sub: string }[] = [
  { value: 'beginner',  label: 'Estou começando agora',  sub: 'Nunca li a Bíblia completa' },
  { value: 'casual',    label: 'Leio às vezes',           sub: 'Conheço algumas histórias' },
  { value: 'regular',   label: 'Leio regularmente',       sub: 'Tenho um hábito de leitura' },
  { value: 'advanced',  label: 'Conheço bem',             sub: 'Tenho estudo aprofundado' },
]

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    name: '',
    life_stage: '',
    reading_frequency: '',
    bible_familiarity: '',
    preferred_hour: '07:00',
  })

  function canProceed(): boolean {
    switch (step) {
      case 1: return data.name.trim().length >= 2
      case 2: return data.life_stage !== ''
      case 3: return data.reading_frequency !== ''
      case 4: return data.bible_familiarity !== ''
      case 5: return true
      default: return false
    }
  }

  async function handleFinish() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('user_profiles').upsert({
      id: user.id,
      name: data.name,
      life_stage: data.life_stage,
      reading_frequency: data.reading_frequency,
      bible_familiarity: data.bible_familiarity,
      preferred_hour: data.preferred_hour,
    })

    if (!error) {
      router.push('/jornadas')
    } else {
      console.error('Erro ao salvar perfil:', error)
      router.push('/home')
    }
    setLoading(false)
  }

  function next() {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else handleFinish()
  }

  function back() {
    if (step > 1) setStep(s => s - 1)
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        background: 'var(--bg-primary)',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        {step > 1 && (
          <button
            onClick={back}
            style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            <ArrowLeft size={22} color="var(--text-secondary)" />
          </button>
        )}
        <div style={{ flex: 1, height: '3px', background: 'var(--border-default)', borderRadius: '100px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--gold)',
              borderRadius: '100px',
              transition: 'width var(--transition-slow)',
            }}
          />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
          {step}/{TOTAL_STEPS}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {step === 1 && (
          <StepName value={data.name} onChange={v => setData(d => ({ ...d, name: v }))} />
        )}
        {step === 2 && (
          <StepLifeStage
            value={data.life_stage}
            onChange={v => setData(d => ({ ...d, life_stage: v }))}
          />
        )}
        {step === 3 && (
          <StepFrequency
            value={data.reading_frequency}
            onChange={v => setData(d => ({ ...d, reading_frequency: v }))}
          />
        )}
        {step === 4 && (
          <StepFamiliarity
            value={data.bible_familiarity}
            onChange={v => setData(d => ({ ...d, bible_familiarity: v }))}
          />
        )}
        {step === 5 && (
          <StepHour
            name={data.name}
            value={data.preferred_hour}
            onChange={v => setData(d => ({ ...d, preferred_hour: v }))}
          />
        )}
      </div>

      {/* CTA */}
      <div style={{ paddingTop: '24px' }}>
        <Button
          onClick={next}
          disabled={!canProceed()}
          loading={loading}
          style={{ gap: '8px' }}
        >
          {step === TOTAL_STEPS ? 'Começar minha jornada' : 'Continuar'}
          {step < TOTAL_STEPS && <ArrowRight size={18} />}
        </Button>
      </div>
    </div>
  )
}

/* ─── Sub-componentes de cada passo ─────────────────────────────────── */

function StepName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        Passo 1 de 5
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Como você prefere ser chamado(a)?
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Vamos personalizar tudo para você.
      </p>
      <Input
        placeholder="Seu nome ou apelido"
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus
        maxLength={50}
      />
    </div>
  )
}

function StepLifeStage({
  value,
  onChange,
}: {
  value: string
  onChange: (v: LifeStage) => void
}) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        Passo 2 de 5
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Qual é o seu momento de vida agora?
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Sua palavra de hoje será ajustada para este momento.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {lifeStageOptions.map(opt => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
          />
        ))}
      </div>
    </div>
  )
}

function StepFrequency({
  value,
  onChange,
}: {
  value: string
  onChange: (v: Frequency) => void
}) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        Passo 3 de 5
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Com que frequência você quer ler?
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Sem pressão — você pode mudar depois.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {frequencyOptions.map(opt => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  )
}

function StepFamiliarity({
  value,
  onChange,
}: {
  value: string
  onChange: (v: Familiarity) => void
}) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        Passo 4 de 5
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Você tem alguma familiaridade com a Bíblia?
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Isso ajuda a calibrar as explicações dos agentes.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {familiarityOptions.map(opt => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            label={opt.label}
            sub={opt.sub}
          />
        ))}
      </div>
    </div>
  )
}

function StepHour({
  name,
  value,
  onChange,
}: {
  name: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        Passo 5 de 5
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Que horas, {name}?
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Enviamos seu Despertar Zakar todo dia neste horário.
      </p>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '32px',
          fontWeight: 400,
          color: 'var(--gold)',
          outline: 'none',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      />
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '12px',
      }}>
        ☀️ Você receberá uma notificação diária neste horário
      </p>
    </div>
  )
}

function OptionCard({
  selected,
  onClick,
  emoji,
  label,
  sub,
}: {
  selected: boolean
  onClick: () => void
  emoji?: string
  label: string
  sub?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'var(--gold-dim)' : 'var(--bg-card)',
        border: `1px solid ${selected ? 'var(--gold)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {emoji && (
        <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      )}
      <div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '14px',
          fontWeight: 600,
          color: selected ? 'var(--gold)' : 'var(--text-primary)',
        }}>
          {label}
        </p>
        {sub && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}>
            {sub}
          </p>
        )}
      </div>
      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: `2px solid ${selected ? 'var(--gold)' : 'var(--border-medium)'}`,
          background: selected ? 'var(--gold)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {selected && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0F172A',
            }} />
          )}
        </div>
      </div>
    </button>
  )
}
