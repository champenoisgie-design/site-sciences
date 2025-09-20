'use client'
import React from 'react'

type Theme = 'light' | 'anime' | 'pirate' | 'lifesim' | 'fantasy'

const LABELS: Record<Theme, string> = {
  light: 'Light',
  anime: 'Anime-combat',
  pirate: 'Pirate-aventure',
  lifesim: 'Life-Sim',
  fantasy: 'Fantasy-MMO',
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<Theme>('light')

  React.useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('cmc.theme')) as Theme | null
    if (stored && (Object.keys(LABELS) as string[]).includes(stored)) {
      setTheme(stored as Theme)
    }
  }, [])

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      try { localStorage.setItem('cmc.theme', theme) } catch {}
      document.cookie = `cmc_theme=${theme}; Max-Age=31536000; Path=/; SameSite=Lax`
    }
  }, [theme])

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTheme(e.target.value as Theme)
  }

  return (
    <div className="card space-y-2">
      <div className="text-sm text-muted">Thème visuel</div>
      <select
        value={theme}
        onChange={onChange}
        className="btn w-full"
        aria-label="Choisir un thème"
      >
        {(Object.keys(LABELS) as Theme[]).map((k) => (
          <option key={k} value={k}>{LABELS[k]}</option>
        ))}
      </select>
    </div>
  )
}
