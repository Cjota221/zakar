import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Webhook recebido do n8n para ações automatizadas
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret')

  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action, user_id, data } = body

  if (!action || !user_id) {
    return NextResponse.json({ error: 'action e user_id obrigatórios' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (action) {
    case 'create_devotional': {
      const { date, verse_reference, verse_text, content, reflection_question, action_of_day } = data
      const { error } = await supabase.from('devotionals').upsert({
        user_id,
        date,
        verse_reference,
        verse_text,
        content,
        reflection_question,
        action_of_day,
        agent_used: 'despertar',
      }, { onConflict: 'user_id,date' })

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, action })
    }

    case 'update_streak': {
      const { streak_current, streak_best, last_read_at } = data
      const { error } = await supabase
        .from('user_profiles')
        .update({ streak_current, streak_best, last_read_at })
        .eq('id', user_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, action })
    }

    case 'award_xp': {
      const { xp } = data
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('xp, level')
        .eq('id', user_id)
        .single()

      if (!profile) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

      const newXp = (profile.xp ?? 0) + xp
      const newLevel = Math.floor(newXp / 500) + 1

      const { error } = await supabase
        .from('user_profiles')
        .update({ xp: newXp, level: Math.min(newLevel, 7) })
        .eq('id', user_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, action, xp: newXp, level: newLevel })
    }

    default:
      return NextResponse.json({ error: `Ação "${action}" desconhecida` }, { status: 400 })
  }
}
