'use client'

import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '@/lib/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isDark
          ? <Moon size={20} color="var(--gold)" weight="fill" />
          : <Sun size={20} color="var(--gold)" weight="fill" />
        }
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
            {isDark ? 'Modo escuro' : 'Modo claro'}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            Toque para alternar
          </p>
        </div>
      </div>

      {/* Toggle pill */}
      <div style={{
        width: '44px',
        height: '24px',
        borderRadius: '100px',
        background: isDark ? 'var(--gold)' : 'var(--border-medium)',
        position: 'relative',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: '3px',
          left: isDark ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s ease',
        }} />
      </div>
    </button>
  )
}
