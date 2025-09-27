"use client"
import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'

function applyTheme(t: Theme) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = t === 'dark' || (t === 'system' && prefersDark)
  root.classList.toggle('dark', isDark)
}

export default function ThemeSwitchInline() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(saved)
    applyTheme(saved)
    const mm = window.matchMedia('(prefers-color-scheme: dark)')
    const cb = () => theme === 'system' && applyTheme('system')
    mm.addEventListener?.('change', cb)
    return () => mm.removeEventListener?.('change', cb)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    applyTheme(theme)
  }, [theme])

  return (
    <label className="flex items-center gap-2 text-sm">
      <span>Thème</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="rounded border bg-transparent px-2 py-1"
        aria-label="Choisir le thème"
      >
        <option value="system">Système</option>
        <option value="light">Clair</option>
        <option value="dark">Sombre</option>
      </select>
    </label>
  )
}
