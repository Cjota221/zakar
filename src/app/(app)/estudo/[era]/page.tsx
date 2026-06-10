export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ERAS_CONTENT } from '@/lib/bible/eras-content'
import { StudyTabs } from '@/components/study/StudyTabs'

interface Props {
  params: Promise<{ era: string }>
}

export default async function EstudoEraPage({ params }: Props) {
  const { era: eraId } = await params
  const era = ERAS_CONTENT.find(e => e.id === eraId)
  if (!era) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Registrar progresso (upsert)
  await supabase.from('era_progress').upsert(
    { user_id: user.id, era_id: eraId, last_studied_at: new Date().toISOString() },
    { onConflict: 'user_id,era_id', ignoreDuplicates: false }
  )

  // Carregar histórico de chat e notas iniciais no servidor
  const [chatResult, notesResult] = await Promise.all([
    supabase
      .from('theology_chat')
      .select('id, role, content, created_at')
      .eq('user_id', user.id)
      .eq('era_id', eraId)
      .order('created_at', { ascending: true })
      .limit(50),
    supabase
      .from('study_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('era_id', eraId)
      .order('created_at', { ascending: false }),
  ])

  return (
    <StudyTabs
      era={era}
      userId={user.id}
      initialChat={chatResult.data ?? []}
      initialNotes={notesResult.data ?? []}
    />
  )
}
