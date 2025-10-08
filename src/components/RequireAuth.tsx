'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

/** MOCK : considère “logged=in” si localStorage.has('__mock_auth__') */
export default function RequireAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    try {
      setLogged(!!localStorage.getItem('__mock_auth__'))
    } catch {}
    setReady(true)
  }, [])

  if (!ready) return null

  if (!logged) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-2">Connexion requise</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Tu dois être connecté pour accéder à ce contenu.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/login"
            className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
