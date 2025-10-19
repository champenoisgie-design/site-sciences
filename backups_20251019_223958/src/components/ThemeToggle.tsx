'use client'
import { useEffect, useState } from 'react'

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[2]) : null
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(getCookie('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365}`
  }, [theme])

  return (
    <button
      className="pill"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      aria-label="Basculer le thème"
    >
      Thème : {theme === 'dark' ? 'sombre' : 'clair'}
    </button>
  )
}
