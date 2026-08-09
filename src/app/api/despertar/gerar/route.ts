import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('devotionals')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existing) {
      return NextResponse.json({ status: 'already_exists' })
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Buscar memórias recentes
    const { data: memories } = await supabase
      .from('user_memories')
      .select('content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    const memoriesText = memories?.map(m => m.content).join('\n') || 'Sem memórias ainda.'

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })
    }

    // Chamar Groq
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `Você é o Zakar, agente de devocional matinal cristão.

Gere um devocional personalizado para ${profile?.name || 'o usuário'} hoje, ${today}.

MEMÓRIAS RECENTES DO USUÁRIO:
${memoriesText}

Responda APENAS com JSON válido, sem markdown:
{
  "verse_reference": "Livro Cap:Ver",
  "verse_text": "texto do versículo (NVI)",
  "content": "palavra de 180-220 palavras, direta, pessoal e conectada à vida do usuário",
  "reflection_question": "uma pergunta reflexiva",
  "action_of_day": "uma ação prática e pequena para hoje"
}`
        }]
      })
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq error:', errText)
      return NextResponse.json({ error: 'Erro ao chamar Groq' }, { status: 500 })
    }

    const groqData = await groqRes.json()
    const rawContent = groqData.choices?.[0]?.message?.content || '{}'
    
    let devotionalData
    try {
      devotionalData = JSON.parse(rawContent)
    } catch {
      devotionalData = {
        verse_reference: 'Salmos 46:10',
        verse_text: 'Aquietai-vos e sabei que eu sou Deus.',
        content: 'Hoje é um dia para pausar e ouvir. Deus está no controle.',
        reflection_question: 'O que você precisa soltar hoje?',
        action_of_day: 'Passe 5 minutos em silêncio antes de começar o dia.'
      }
    }

    // Salvar no Supabase
    await supabase
      .from('devotionals')
      .upsert({
        user_id: user.id,
        date: today,
        ...devotionalData,
        generated_by: 'fallback-groq'
      }, { onConflict: 'user_id,date' })

    return NextResponse.json({ status: 'generated', devotional: devotionalData })
  } catch (error) {
    console.error('Erro ao gerar devocional:', error)
    return NextResponse.json({ error: 'Erro ao gerar devocional' }, { status: 500 })
  }
}