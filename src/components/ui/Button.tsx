'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--gold)',
    color: '#0F172A',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--gold)',
    border: '1.5px solid var(--gold)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--color-error)',
    border: '1.5px solid var(--color-error)',
  },
}

const hoverStyles: Record<Variant, Partial<React.CSSProperties>> = {
  primary: { background: 'var(--gold-hover)' },
  ghost: { background: 'var(--gold-dim)' },
  danger: { background: 'rgba(220, 38, 38, 0.08)' },
}

export default function Button({
  variant = 'primary',
  children,
  fullWidth = true,
  loading = false,
  style,
  onMouseEnter,
  onMouseLeave,
  disabled,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    padding: '14px 24px',
    height: '52px',
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled || loading ? 0.5 : 1,
    ...styles[variant],
    ...style,
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={base}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyles[variant])
        }
        onMouseEnter?.(e)
      }}
      onMouseLeave={e => {
        Object.assign(e.currentTarget.style, styles[variant])
        onMouseLeave?.(e)
      }}
    >
      {loading ? <TypingDots /> : children}
    </button>
  )
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'currentColor',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
