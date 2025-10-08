'use client'
import { createContext, useContext, useEffect, useState } from 'react'
type Theme = 'light' | 'anime' | 'pirate' | 'lifesim' | 'fantasy'
const STORAGE = 'cmc.theme'
const C = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(
  null,
)

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const local = (typeof window !== 'undefined' &&
      localStorage.getItem(STORAGE)) as Theme | null
    if (
      local &&
      ['light', 'anime', 'pirate', 'lifesim', 'fantasy'].includes(local)
    )
      setTheme(local)
  }, [])
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      try {
        localStorage.setItem(STORAGE, theme)
      } catch {}
    }
  }, [theme])
  return <C.Provider value={{ theme, setTheme }}>{children}</C.Provider>
}
export const useTheme = () => {
  const v = useContext(C)
  if (!v) throw new Error('useTheme outside provider')
  return v
}
