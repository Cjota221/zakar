export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDailyPsalmNumber, getDailyProverbChapter, getTodayString } from '@/lib/daily-content'
import { DailyPrayerSection } from '@/components/oracoes/DailyPrayerSection'
import { DailyScriptureCard } from '@/components/oracoes/DailyScriptureCard'

export default async function OracoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = getTodayString()
  const psalmNum = getDailyPsalmNumber()
  const proverbChapter = getDailyProverbChapter()

  // Buscar oração do dia já existente
  const { data: todaysPrayer } = await supabase
    .from('daily_prayers')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle()

  return (
    <div className="page-enter" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Momento de paz
        </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
          Orações
        </div>
      </div>

      {/* Oração do dia */}
      <DailyPrayerSection initialPrayer={todaysPrayer} />

      {/* Salmo do dia */}
      <DailyScriptureCard
        type="psalm"
        number={psalmNum}
        label={`Salmo ${psalmNum}`}
        badge="Salmo do Dia"
        href={`/biblia/sl/${psalmNum}`}
      />

      {/* Provérbio do dia */}
      <DailyScriptureCard
        type="proverb"
        number={proverbChapter}
        label={`Provérbios ${proverbChapter}`}
        badge="Provérbio do Dia"
        href={`/biblia/pv/${proverbChapter}`}
      />
    </div>
  )
}
