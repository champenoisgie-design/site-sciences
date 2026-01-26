'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type MeResponse = {
  user: null | {
    id: string
    email?: string | null
    name?: string | null
    trialEndsAt?: string | null
    trialStartAt?: string | null
    trialGrade?: string | null
    trialSubject?: string | null
  }
}

function formatRemaining(ms: number) {
  if (ms <= 0) return '0h 0m'
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h}h ${m}m`
}

export default function HomeTrialBanner() {
  const [me, setMe] = useState<MeResponse>({ user: null })
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then((data) => { if (mounted) setMe(data) })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  const trial = useMemo(() => {
    const u = me.user
    if (!u?.trialEndsAt) return { active: false as const }
    const end = new Date(u.trialEndsAt).getTime()
    const remaining = end - now
    return { active: remaining > 0, remaining }
  }, [me.user, now])

  if (!me.user) {
    return (
      <div className="w-full bg-emerald-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm sm:text-base">
          <strong>Inscris-toi et teste gratuitement pendant 3 jours</strong>
        </div>
      </div>
    )
  }

  if (trial.active) {
    return (
      <div className="w-full bg-amber-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm sm:text-base">
          <strong>Essai gratuit en cours</strong> — temps restant :{' '}
          <span className="font-semibold">{formatRemaining(trial.remaining)}</span>
          <span className="mx-2">•</span>
          <Link href="/tarifs" className="underline underline-offset-4 font-semibold">
            Passer à l’abonnement
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-rose-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm sm:text-base">
        <strong>Essai terminé</strong> —{' '}
        <Link href="/tarifs" className="underline underline-offset-4 font-semibold">
          Voir les tarifs pour continuer
        </Link>
      </div>
    </div>
  )
}
