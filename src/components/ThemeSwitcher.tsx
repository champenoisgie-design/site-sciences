'use client'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'anime' | 'pirate' | 'lifesim' | 'fantasy'
const LABELS: Record<Theme, string> = {
  light: 'Light',
  anime: 'Anime-combat',
  pirate: 'Pirate-aventure',
  lifesim: 'Life-Sim',
  fantasy: 'Fantasy-MMO',
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('cmc.theme')) as Theme | null
    if (stored && Object.keys(LABELS).includes(stored)) setTheme(stored)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      try { localStorage.setItem('cmc.theme', theme) } catch {}
      document.cookie = `cmc_theme=${theme}; Max-Age=31536000; Path=/; SameSite=Lax`
    }
  }, [theme])

  return (
    <div className="card space-y-2">
      <div className="text-sm text-muted">Thème visuel</div>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="btn w-full"
        aria-label="Choisir un thème"
      >
        {Object.entries(LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </div>
  )
}
