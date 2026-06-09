'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BookOpen, Path, User } from '@phosphor-icons/react'

const navItems = [
  { href: '/home',     label: 'Home',    Icon: House },
  { href: '/biblia',   label: 'Bíblia',  Icon: BookOpen },
  { href: '/jornadas', label: 'Jornadas', Icon: Path },
  { href: '/perfil',   label: 'Perfil',  Icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'var(--bg-card)',
        borderTop: '0.5px solid var(--border-default)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '8px 16px',
              textDecoration: 'none',
            }}
          >
            <Icon
              size={26}
              weight={active ? 'fill' : 'regular'}
              color={active ? 'var(--gold)' : 'var(--text-muted)'}
            />
            {active && (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
