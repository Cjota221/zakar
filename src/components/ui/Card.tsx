import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: string
}

export default function Card({ children, padding = '16px', style, ...props }: CardProps) {
  return (
    <div
      {...props}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding,
        border: '0.5px solid var(--border-default)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
