import type { Metadata, Viewport } from 'next'
import './globals.css'
import { FontScaleProvider } from '@/lib/contexts/FontScaleContext'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Zakar — Discipulado Bíblico',
  description: 'O app de discipulado bíblico com memória real e contínua. Sua palavra certa, no momento certo.',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/fivon-zakar.png', type: 'image/png' }],
    apple: [{ url: '/fivon-zakar.png', type: 'image/png' }],
    shortcut: '/fivon-zakar.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Zakar',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <FontScaleProvider>{children}</FontScaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
