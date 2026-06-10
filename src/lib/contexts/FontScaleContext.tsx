'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const SCALE_VALUES = [0.85, 0.92, 1.0, 1.12, 1.25]
const SCALE_LABELS = ['Muito pequeno', 'Pequeno', 'Padrão', 'Grande', 'Muito grande']

interface FontScaleContextType {
  scaleIndex: number
  setScaleIndex: (i: number) => void
  scaleValue: number
  scaleLabel: string
}

const FontScaleContext = createContext<FontScaleContextType>({
  scaleIndex: 2,
  setScaleIndex: () => {},
  scaleValue: 1.0,
  scaleLabel: 'Padrão',
})

export function FontScaleProvider({ children }: { children: React.ReactNode }) {
  const [scaleIndex, setScaleIndexState] = useState(2)

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem('zakar-font-scale')
      if (saved !== null) {
        const idx = Number(saved)
        const nextIndex = Number.isInteger(idx) && SCALE_VALUES[idx] ? idx : 2
        setScaleIndexState(nextIndex)
        document.documentElement.style.setProperty('--font-scale', String(SCALE_VALUES[nextIndex]))
      }
    })
  }, [])

  const setScaleIndex = (i: number) => {
    setScaleIndexState(i)
    localStorage.setItem('zakar-font-scale', String(i))
    document.documentElement.style.setProperty('--font-scale', String(SCALE_VALUES[i]))
    saveToSupabase(SCALE_VALUES[i])
  }

  return (
    <FontScaleContext.Provider value={{
      scaleIndex,
      setScaleIndex,
      scaleValue: SCALE_VALUES[scaleIndex],
      scaleLabel: SCALE_LABELS[scaleIndex],
    }}>
      {children}
    </FontScaleContext.Provider>
  )
}

export const useFontScale = () => useContext(FontScaleContext)

async function saveToSupabase(scale: number) {
  try {
    await fetch('/api/preferencias', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ font_scale: scale }),
    })
  } catch {}
}
