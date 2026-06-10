'use client'
import { usePushNotification } from '@/lib/hooks/usePushNotification'

export function NotificationSettings() {
  const { permission, isSubscribed, isSupported, subscribe, unsubscribe } = usePushNotification()

  if (!isSupported) {
    return (
      <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 12, border: '0.5px solid var(--border-default)' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>
          Para receber notificações, instale o Zakar na tela inicial do seu celular.
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '0.5px solid var(--border-default)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Despertar Zakar
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Receba sua palavra todos os dias às 05:00
          </div>
        </div>
        <div
          role="switch"
          aria-checked={isSubscribed}
          onClick={isSubscribed ? unsubscribe : subscribe}
          style={{
            width: 44, height: 24, borderRadius: 100,
            background: isSubscribed ? '#D4AF37' : 'var(--bg-secondary)',
            position: 'relative', cursor: 'pointer',
            transition: 'background 0.2s ease',
            border: '0.5px solid var(--border-default)',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', top: 2,
            left: isSubscribed ? 22 : 2,
            width: 20, height: 20, borderRadius: '50%',
            background: isSubscribed ? '#0F172A' : 'var(--text-muted)',
            transition: 'left 0.2s ease',
          }} />
        </div>
      </div>

      {permission === 'denied' && (
        <div style={{ padding: '10px 16px', borderTop: '0.5px solid var(--border-default)', background: 'rgba(220,38,38,0.05)' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#DC2626' }}>
            Notificações bloqueadas. Acesse as configurações do navegador para permitir.
          </div>
        </div>
      )}
    </div>
  )
}
