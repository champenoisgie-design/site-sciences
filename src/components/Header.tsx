"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import ModeLearningSwitcher from '@/components/ModeLearningSwitcher'
import { useEffect, useState } from 'react'

const navRight = [
  { href: '/', label: 'Accueil' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/contact', label: 'Contact' },
]

async function fetchMe(): Promise<{
  user: { name?: string; email?: string } | null
}> {
  const res = await fetch('/api/auth/me', {
    cache: 'no-store',
    headers: { 'cache-control': 'no-store' },
  })
  return res.json()
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null,
  )

  useEffect(() => {
    let mounted = true
    fetchMe()
      .then((d) => mounted && setUser(d.user))
      .catch(() => {})
    const onFocus = () =>
      fetchMe()
        .then((d) => setUser(d.user))
        .catch(() => {})
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      mounted = false
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.refresh()
  }

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-3">
        {/* Gauche : Titre */}
        <Link href="/" className="font-semibold">
          Site Sciences
        </Link>

        {/* Centre : switch Thème + switch Mode d’apprentissage (une seule fois) */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ModeLearningSwitcher />
        </div>

        {/* Droite : Navigation + Connexion/Compte */}
        <ul className="flex items-center gap-2">
          {navRight.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded px-3 py-1 text-sm transition 
                    ${active ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            )
          })}
          <li className="pl-2 ml-2 border-l flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Se connecter
                </Link>
                <Link
                  href="/login"
                  className="rounded px-3 py-1 text-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Créer un compte
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/account"
                  className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Mon compte
                </Link>
                <button
                  onClick={logout}
                  className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Déconnexion
                </button>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}
