'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BookOpen, HandsPraying, Path, User } from '@phosphor-icons/react'

const navItems = [
  { href: '/home',     label: 'Home',    Icon: House },
  { href: '/biblia',   label: 'Bíblia',  Icon: BookOpen },
  { href: '/oracoes',  label: 'Orações', Icon: HandsPraying },
  { href: '/jornadas', label: 'Jornadas', Icon: Path },
  { href: '/perfil',   label: 'Perfil',  Icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="app-nav">
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`app-nav-link ${active ? 'app-nav-link-active' : ''}`}
            aria-label={label}
          >
            <Icon
              size={19}
              weight={active ? 'fill' : 'regular'}
              color="currentColor"
            />
            <span className="app-nav-label">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
