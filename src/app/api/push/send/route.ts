export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const authHeader = req.headers.get('x-zakar-key')
  if (authHeader !== process.env.ZAKAR_INTERNAL_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vapidEmail = process.env.VAPID_EMAIL
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

  if (!vapidEmail || !vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 })
  }

  // Dynamic import prevents web-push from being evaluated at build time
  const webpush = (await import('web-push')).default
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)

  const { userId, title, body, url } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const payload = JSON.stringify({
    title: title || '☀️ Zakar',
    body: body || 'Sua palavra de hoje chegou.',
    url: url || '/home',
    icon: '/fivon-zakar.png',
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  if (failed > 0) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'rejected') {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscriptions[i].endpoint)
      }
    }
  }

  return NextResponse.json({ sent, failed })
}
