'use client'
import { createContext, useContext, useEffect, useState } from 'react'
export type UIMode = 'normal' | 'tdah' | 'dys' | 'tsa' | 'hpi'
const STORAGE = 'cmc.mode'
const C = createContext<{mode: UIMode, setMode: (m: UIMode)=>void} | null>(null)

export default function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<UIMode>('normal')
  useEffect(() => {
    const local = (typeof window !== 'undefined' && localStorage.getItem(STORAGE)) as UIMode | null
    if (local && ['normal','tdah','dys','tsa','hpi'].includes(local)) setMode(local)
  }, [])
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mode', mode)
      try { localStorage.setItem(STORAGE, mode) } catch {}
    }
  }, [mode])
  return <C.Provider value={{ mode, setMode }}>{children}</C.Provider>
}
export const useMode = () => { const v = useContext(C); if (!v) throw new Error('useMode outside provider'); return v }

