'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type UIMode = 'normal' | 'tdah' | 'dys' | 'tsa' | 'hpi'
type Ctx = { mode: UIMode; setMode: (m: UIMode) => void }
const C = createContext<Ctx | null>(null)

export default function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<UIMode>('normal')

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('cmc.mode')) as UIMode | null
    if (stored && ['normal', 'tdah', 'dys', 'tsa', 'hpi'].includes(stored)) {
      setMode(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mode', mode)
      try { localStorage.setItem('cmc.mode', mode) } catch {}
      document.cookie = `cmc_mode=${mode}; Max-Age=31536000; Path=/; SameSite=Lax`
    }
  }, [mode])

  return <C.Provider value={{ mode, setMode }}>{children}</C.Provider>
}

export const useMode = () => {
  const v = useContext(C)
  if (!v) throw new Error('useMode must be used within ModeProvider')
  return v
}
