'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type MeResponse = {
  user: null | {
    id: string
    trialEndsAt?: string | null
  }
}

export default function HomeHeroCTA() {
  const [me, setMe] = useState<MeResponse>({ user: null })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then((data) => { if (mounted) { setMe(data); setLoaded(true) } })
      .catch(() => { if (mounted) setLoaded(true) })
    return () => { mounted = false }
  }, [])

  // Tant que pas chargé : on affiche le CTA "Commencer l’essai" (safe)
  const isLoggedIn = loaded ? Boolean(me.user) : false

  if (!isLoggedIn) {
    return (
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700 active:scale-[0.99] transition"
        >
          Commencer l’essai gratuit
        </Link>

        <Link
          href="/tarifs"
          className="inline-flex items-center justify-center rounded-lg border px-5 py-3 font-medium hover:bg-accent active:scale-[0.99] transition"
        >
          Voir les tarifs
        </Link>

        <div className="w-full text-sm text-muted-foreground">
          Déjà inscrit ?{' '}
          <Link href="/auth/login" className="underline underline-offset-4 hover:text-foreground">
            Me connecter
          </Link>
        </div>
      </div>
    )
  }

  // Connecté : on remplace par CTA “continuer”
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/exercices"
        className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-3 text-white font-semibold hover:bg-zinc-800 active:scale-[0.99] transition dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Continuer
      </Link>

      <Link
        href="/compte"
        className="inline-flex items-center justify-center rounded-lg border px-5 py-3 font-medium hover:bg-accent active:scale-[0.99] transition"
      >
        Mon compte
      </Link>

      <Link
        href="/tarifs"
        className="inline-flex items-center justify-center rounded-lg border px-5 py-3 font-medium hover:bg-accent active:scale-[0.99] transition"
      >
        Tarifs
      </Link>
    </div>
  )
}
