'use client'
import { useState, useEffect } from 'react'

export function InstallBanner() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null)

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    if (isInstalled) return

    const dismissed = localStorage.getItem('zakar-install-dismissed')
    if (dismissed) return

    const ua = navigator.userAgent
    const ios = /iphone|ipad|ipod/i.test(ua)
    const android = /android/i.test(ua)

    setIsIOS(ios)
    setIsAndroid(android)

    if (ios) {
      setTimeout(() => setShow(true), 3000)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> })
      setIsAndroid(true)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
  }

  function handleDismiss() {
    localStorage.setItem('zakar-install-dismissed', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 88,
      left: 16,
      right: 16,
      background: '#1E293B',
      border: '1px solid rgba(212,175,55,0.3)',
      borderRadius: 16,
      padding: 16,
      zIndex: 999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: 18, lineHeight: 1,
        }}
      >✕</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: '#0F172A', border: '1px solid rgba(212,175,55,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#D4AF37',
        }}>Z</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#F9F9F6' }}>
            Instale o Zakar
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>
            Acesse mais rápido e receba sua palavra diária
          </div>
        </div>
      </div>

      {isIOS && (
        <div style={{
          background: 'rgba(15,23,42,0.6)', borderRadius: 10,
          padding: 12, marginBottom: 12,
        }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
            Para instalar no iPhone:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[
              { step: '1', text: 'Abra este site no Safari' },
              { step: '2', text: 'Toque no ícone de compartilhar (□↑) na barra inferior' },
              { step: '3', text: 'Role e toque em "Adicionar à Tela de Início"' },
              { step: '4', text: 'Toque em "Adicionar" no canto superior direito' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(212,175,55,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: '#D4AF37', flexShrink: 0,
                }}>{item.step}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#F9F9F6' }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAndroid && deferredPrompt && (
        <button
          onClick={handleInstall}
          style={{
            width: '100%', background: '#D4AF37', color: '#0F172A',
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
            border: 'none', borderRadius: 10, padding: '12px',
            cursor: 'pointer', marginBottom: 8,
          }}
        >
          Instalar agora
        </button>
      )}

      <button
        onClick={handleDismiss}
        style={{
          width: '100%', background: 'transparent', color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)', fontSize: 12, border: 'none',
          cursor: 'pointer', padding: '4px',
        }}
      >
        Agora não
      </button>
    </div>
  )
}
