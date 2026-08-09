import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const today = new Date().toISOString().split('T')[0]
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: devotional } = await supabase
      .from('devotionals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (!devotional) {
      return NextResponse.json({ 
        status: 'pending', 
        message: 'Devocional ainda não gerado para hoje' 
      })
    }

    return NextResponse.json({ status: 'ok', devotional })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}