import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTodayString } from '@/lib/daily-content'

const LIFE_STAGE_LABELS: Record<string, string> = {
  restarting: 'em recomeço',
  purpose: 'buscando propósito',
  growing: 'crescendo na fé',
  struggling: 'passando por dificuldades',
  stable: 'estável e grato',
}

const WEEKLY_THEMES = [
  'gratidão e dependência de Deus',
  'fé em meio à incerteza',
  'renovação e esperança',
  'propósito e missão',
  'graça e perdão',
  'paz que transcende o entendimento',
  'força e coragem',
]

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = getTodayString()

  // Verificar se já existe oração do dia
  const { data: existing } = await supabase
    .from('daily_prayers')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle()

  if (existing) return NextResponse.json(existing)

  // Buscar perfil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, life_stage')
    .eq('id', user.id)
    .single()

  const lifeStage = LIFE_STAGE_LABELS[profile?.life_stage ?? ''] ?? 'buscando crescer na fé'
  const weekNum = Math.floor(new Date().getDate() / 7)
  const weeklyTheme = WEEKLY_THEMES[weekNum % WEEKLY_THEMES.length]

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

  const prompt = `Você é um guia espiritual do Zakar App.
Escreva uma oração em primeira pessoa (como se o usuário estivesse orando) baseada em:
- Momento de vida do usuário: ${lifeStage}
- Tema da semana: ${weeklyTheme}

A oração deve:
- Ter entre 100-150 palavras
- Ser em linguagem contemporânea e sincera
- Começar com um reconhecimento de quem é Deus
- Incluir uma petição específica relacionada ao momento de vida
- Terminar com gratidão e rendição
- Citar um versículo dos Salmos dentro da oração (versículo NVI)

Responda APENAS com JSON válido, sem markdown, sem texto extra:
{"verse_reference":"Salmos X:Y","verse_text":"texto do versículo em NVI","prayer":"texto completo da oração"}`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 512,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) throw new Error(await res.text())

    const data = await res.json()
    const parsed = JSON.parse(data.choices[0].message.content)

    const { data: saved } = await supabase
      .from('daily_prayers')
      .insert({
        user_id: user.id,
        date: today,
        verse_reference: parsed.verse_reference,
        verse_text: parsed.verse_text,
        prayer: parsed.prayer,
      })
      .select()
      .single()

    return NextResponse.json(saved)
  } catch (e) {
    console.error('Prayer generation error:', e)
    return NextResponse.json({ error: 'Erro ao gerar oração' }, { status: 500 })
  }
}
