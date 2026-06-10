self.addEventListener('push', function (event) {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body || 'Sua palavra de hoje chegou.',
    icon: '/fivon-zakar.png',
    badge: '/fivon-zakar.png',
    image: data.image || null,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/home',
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Ler agora' },
      { action: 'close', title: 'Fechar' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Zakar', options)
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  if (event.action === 'close') return

  const url = event.notification.data?.url || '/home'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url)
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})
