'use client'

import Link from 'next/link'
import ModeSwitcher from '@/components/ModeSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import { useEffect } from 'react'

export default function Header() {
  useEffect(() => {
    // Sync silencieux DB → cookies (si loggé)
    fetch('/api/entitlements/sync').catch(() => {})
  }, [])

  return (
    <header className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <Link href="/" className="brand">
            Site Sciences
          </Link>
          <span className="v-sep" aria-hidden="true" />
          <div className="controls">
            <ThemeToggle />
            <div className="mode-block">
              <span className="mode-caption">Mode d’apprentissage</span>
              <ModeSwitcher />
            </div>
          </div>
        </div>
        <nav className="topbar-right">
          <Link className="pill pill-link" href="/">
            Accueil
          </Link>
          <Link className="pill pill-link" href="/tarifs">
            Tarifs
          </Link>
          <Link className="pill pill-link" href="/contact">
            Contact
          </Link>
          <Link className="pill pill-link" href="/account">
            Mon compte
          </Link>
          <Link className="pill pill-link" href="/logout">
            Déconnexion
          </Link>
        </nav>
      </div>
    </header>
  )
}
