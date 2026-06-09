import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Agentes disponíveis e seus papéis
const AGENT_PROMPTS: Record<string, string> = {
  historiador: 'Você é o Historiador, especialista em contexto histórico, cultural e geográfico da Bíblia. Explique o contexto do período, os costumes da época e o cenário onde os eventos bíblicos ocorreram. Seja preciso, educativo e fascinante.',
  conselheiro: 'Você é o Conselheiro, um guia espiritual gentil e empático. Ajude o usuário a aplicar os ensinamentos bíblicos à sua vida atual, com sensibilidade às suas dores e momentos de vida. Seja acolhedor e prático.',
  doutrinador: 'Você é o Doutrinador, especialista em teologia e doutrina cristã. Explique os fundamentos teológicos, compare interpretações de diferentes tradições e ajude o usuário a entender a profundidade doutrinária do texto.',
  especialista: 'Você é o Especialista Bíblico, com profundo conhecimento das línguas originais (hebraico e grego), hermenêutica e exegese. Analise o texto em profundidade, explique nuances linguísticas e contexto literário.',
  despertar: 'Você é o Zakar, companheiro de discipulado matinal. Gere um devocional personalizado, acolhedor e transformador com base no perfil e momento de vida do usuário.',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, agent, context_book, context_chapter, context_verse } = await req.json()

  if (!message || !agent) {
    return NextResponse.json({ error: 'message e agent são obrigatórios' }, { status: 400 })
  }

  const systemPrompt = AGENT_PROMPTS[agent]
  if (!systemPrompt) {
    return NextResponse.json({ error: `Agente "${agent}" não encontrado` }, { status: 400 })
  }

  const apiKey = process.env.GROK_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GROK_API_KEY não configurada' }, { status: 500 })
  }

  // Buscar perfil do usuário para personalização
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('name, life_stage, bible_familiarity, denomination')
    .eq('id', user.id)
    .single()

  const userContext = profile
    ? `\n\nContexto do usuário: nome ${profile.name ?? 'não informado'}, momento de vida: ${profile.life_stage ?? 'não informado'}, familiaridade bíblica: ${profile.bible_familiarity ?? 'não informada'}${profile.denomination ? `, denominação: ${profile.denomination}` : ''}.`
    : ''

  const bibleContext = context_book
    ? `\n\nPassagem em estudo: ${context_book}${context_chapter ? ` capítulo ${context_chapter}` : ''}${context_verse ? ` versículo ${context_verse}` : ''}.`
    : ''

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3-mini',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt + userContext + bibleContext },
          { role: 'user', content: message },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await response.json()
    const agentResponse = data.choices[0]?.message?.content ?? ''

    // Salvar no log
    await supabase.from('chat_logs').insert({
      user_id: user.id,
      agent,
      user_message: message,
      agent_response: agentResponse,
      context_book: context_book ?? null,
      context_chapter: context_chapter ?? null,
      context_verse: context_verse ?? null,
      tokens_used: (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0),
    })

    return NextResponse.json({ response: agentResponse })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao chamar a IA' }, { status: 500 })
  }
}
