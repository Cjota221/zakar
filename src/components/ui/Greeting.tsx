'use client'

import { useEffect, useState } from 'react'

function getGreeting(hour: number) {
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()))
  }, [])

  if (!greeting) return null

  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-muted)',
      marginBottom: '4px',
    }}>
      {greeting}, {name}
    </p>
  )
}
