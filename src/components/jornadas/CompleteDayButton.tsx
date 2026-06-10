'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from '@phosphor-icons/react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  journeyId: string
  dayNumber: number
  isLast: boolean
}

export function CompleteDayButton({ journeyId, dayNumber, isLast }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function complete() {
    setLoading(true)
    const supabase = createClient()

    const nextDay = dayNumber + 1
    const newStatus = isLast ? 'completed' : 'active'

    await supabase
      .from('user_journey_progress')
      .update({
        current_day: isLast ? dayNumber : nextDay,
        status: newStatus,
      })
      .eq('journey_id', journeyId)

    router.push(`/jornadas/${journeyId}`)
    router.refresh()
  }

  return (
    <button
      onClick={complete}
      disabled={loading}
      style={{
        width: '100%',
        padding: '15px',
        background: loading ? 'var(--border-default)' : 'var(--gold)',
        color: loading ? 'var(--text-muted)' : '#0F172A',
        border: 'none',
        borderRadius: 14,
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'background 0.2s ease',
      }}
    >
      <CheckCircle size={18} weight="fill" />
      {loading ? 'Salvando...' : isLast ? 'Concluir jornada!' : `Concluir dia ${dayNumber}`}
    </button>
  )
}
