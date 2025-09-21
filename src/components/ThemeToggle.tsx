"use client"
import { useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark" | "system"
const KEY = "__theme_pref__"

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = theme === "dark" || (theme === "system" && sysDark)
  root.classList.toggle("dark", isDark)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system")

  // Au montage : charge la préférence + applique
  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? "system"
    setTheme(stored)
    applyTheme(stored)
  }, [])

  // Sur changement : applique + persiste
  useEffect(() => {
    localStorage.setItem(KEY, theme)
    applyTheme(theme)
  }, [theme])

  // Si "system", réagit aux changements de l'OS
  useEffect(() => {
    if (theme !== "system") return
    const m = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")
    m.addEventListener?.("change", handler)
    return () => m.removeEventListener?.("change", handler)
  }, [theme])

  const label = useMemo(() => {
    if (theme === "light") return "Thème : clair"
    if (theme === "dark") return "Thème : sombre"
    return "Thème : système"
  }, [theme])

  function next() {
    setTheme(t => (t === "light" ? "dark" : t === "dark" ? "system" : "light"))
  }

  return (
    <button
      onClick={next}
      title={label}
      aria-label={label}
      className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  )
}
