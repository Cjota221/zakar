'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, style, onFocus, onBlur, id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        {...props}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--text-primary)',
          width: '100%',
          outline: 'none',
          transition: 'border-color var(--transition-fast)',
          ...style,
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--border-focus)'
          onFocus?.(e)
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--border-default)'
          onBlur?.(e)
        }}
      />
      {error && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--color-error)',
        }}>
          {error}
        </span>
      )}
    </div>
  )
})

export default Input
