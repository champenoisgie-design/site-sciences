'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type MeUser = {
  id: string
  email?: string | null
  name?: string | null
  trialEndsAt?: string | null
  trialGrade?: string | null
  trialSubject?: string | null
}

type MeResponse = { user: MeUser | null }

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n))
}

function formatRemaining(ms: number) {
  if (ms <= 0) return '0h 0m'
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h}h ${m}m`
}

function ProgressBar({ value }: { value: number }) {
  const v = clamp(value)
  return (
    <div className="h-3 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${v}%` }} />
    </div>
  )
}

export default function HomeStudentDashboard() {
  const [me, setMe] = useState<MeResponse>({ user: null })
  const [loaded, setLoaded] = useState(false)
  const [now, setNow] = useState(Date.now())

  // fetch me
  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then((data) => { if (mounted) { setMe(data); setLoaded(true) } })
      .catch(() => { if (mounted) setLoaded(true) })
    return () => { mounted = false }
  }, [])

  // timer
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  const user = me.user

  // ✅ hooks safe: useMemo called every render, even if user is null
  const trial = useMemo(() => {
    const endsAt = user?.trialEndsAt
    if (!endsAt) return { active: false as const, remainingMs: 0 }
    const end = new Date(endsAt).getTime()
    const remainingMs = end - now
    return { active: remainingMs > 0, remainingMs }
  }, [user?.trialEndsAt, now])

  // ---- mock data (à brancher Prisma ensuite) ----
  const xpCurrent = 1200
  const xpGoal = 2000
  const xpPct = Math.round((xpCurrent / xpGoal) * 100)

  const dailyProgress = 55
  const dailyGoalText = 'Défi du jour : Vitesses & unités'

  // ---- Assets (vision: Vercel Blob) ----
  const ASSETS = {
    bg: '/home-dashboard/bg.jpg',
    avatar: '/home-dashboard/avatar.png',
    training1: '/home-dashboard/training-1.png',
    training2: '/home-dashboard/training-2.png',
    unlock1: '/home-dashboard/unlock-1.png',
    unlock2: '/home-dashboard/unlock-2.png',
    lockedSubject: '/home-dashboard/locked-subject.jpg',
    skin1: '/home-dashboard/skin-1.png',
    skin2: '/home-dashboard/skin-2.png',
    skin3: '/home-dashboard/skin-3.png',
  } as const

  // render gating AFTER hooks
  if (!loaded) return null
  if (!user) return null

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Fond */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.bg})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90 dark:from-black/60 dark:via-black/60 dark:to-black/70" />

      <div className="relative h-full overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Bandeau trial */}
          {trial.active ? (
            <div className="mb-4 rounded-2xl border bg-white/70 backdrop-blur-md px-4 py-3 text-sm shadow-sm dark:bg-black/40">
              <span className="font-semibold">Essai gratuit en cours</span> — temps restant :{' '}
              <span className="font-semibold">{formatRemaining(trial.remainingMs)}</span>
              <span className="mx-2">•</span>
              <Link href="/tarifs" className="underline underline-offset-4 font-semibold">
                Passer à l’abonnement
              </Link>
            </div>
          ) : null}

          {/* Hero */}
          <div className="rounded-3xl border bg-white/70 backdrop-blur-md shadow-sm dark:bg-black/40 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Bienvenue{user.name ? `, ${user.name}` : ''} !</div>
                  <h1 className="mt-1 text-3xl font-bold md:text-4xl">Reprends ta progression</h1>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Niveau : <span className="font-medium">{user.trialGrade ?? '—'}</span> • Matière :{' '}
                    <span className="font-medium">{user.trialSubject ?? '—'}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/exercices"
                      className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-white font-semibold hover:bg-zinc-800 active:scale-[0.99] transition dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                      Continuer
                    </Link>
                    <Link
                      href="/compte"
                      className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-medium hover:bg-accent active:scale-[0.99] transition"
                    >
                      Mon compte
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <img src={ASSETS.avatar} alt="" className="h-20 w-20 rounded-2xl border object-cover bg-white/60" />
                  <div className="min-w-[220px]">
                    <div className="text-xs text-muted-foreground">XP progression</div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <div className="text-lg font-semibold">{xpCurrent} / {xpGoal}</div>
                      <div className="text-xs text-muted-foreground">{xpPct}%</div>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={xpPct} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Encore <span className="font-semibold">{xpGoal - xpCurrent} XP</span> pour débloquer l’évolution suivante.
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 cartes principales */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-sm dark:bg-black/35">
                  <div className="text-xs text-muted-foreground">Défi du jour</div>
                  <div className="mt-1 text-xl font-semibold">{dailyGoalText}</div>
                  <div className="mt-4">
                    <ProgressBar value={dailyProgress} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Progression</div>
                    <div className="text-sm font-semibold">{dailyProgress}%</div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href="/exercices"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700 active:scale-[0.99] transition"
                    >
                      Continuer
                    </Link>
                    <Link
                      href="/progression"
                      className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-medium hover:bg-accent active:scale-[0.99] transition"
                    >
                      Progression
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-sm dark:bg-black/35">
                  <div className="text-xs text-muted-foreground">Chapitre en cours</div>
                  <div className="mt-1 text-xl font-semibold">Mouvements et vitesses</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Reprends ta série d’exercices (tutoriel + entraînement + défi).
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/exercices"
                      className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-white font-semibold hover:bg-zinc-800 active:scale-[0.99] transition dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                      Reprendre
                    </Link>
                  </div>
                </div>
              </div>

              {/* Entraînement + packs */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-sm dark:bg-black/35">
                  <div className="text-xs text-muted-foreground">Entraînement de semaine</div>
                  <div className="mt-1 text-lg font-semibold">Recommandé pour toi</div>

                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center gap-3 rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                      <img src={ASSETS.training1} alt="" className="h-12 w-12 rounded-lg border object-cover bg-white/60" />
                      <div className="flex-1">
                        <div className="font-medium">Série rapide : conversions</div>
                        <div className="text-xs text-muted-foreground">10 min • +250 XP</div>
                      </div>
                      <Link href="/exercices" className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">
                        Reprendre
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                      <img src={ASSETS.training2} alt="" className="h-12 w-12 rounded-lg border object-cover bg-white/60" />
                      <div className="flex-1">
                        <div className="font-medium">Quiz : unités</div>
                        <div className="text-xs text-muted-foreground">8 min • +180 XP</div>
                      </div>
                      <Link href="/exercices" className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">
                        Reprendre
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-sm dark:bg-black/35">
                  <div className="text-xs text-muted-foreground">À débloquer</div>
                  <div className="mt-1 text-lg font-semibold">Packs & chapitres</div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                      <img src={ASSETS.unlock1} alt="" className="h-20 w-full rounded-lg border object-cover bg-white/60" />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Pack “Vitesse++”</div>
                        <Link href="/panier?tab=chapters" className="text-sm font-semibold text-emerald-700 underline underline-offset-4">
                          Obtenir
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                      <img src={ASSETS.unlock2} alt="" className="h-20 w-full rounded-lg border object-cover bg-white/60" />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Pack “Énergie”</div>
                        <Link href="/panier?tab=chapters" className="text-sm font-semibold text-emerald-700 underline underline-offset-4">
                          Obtenir
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bas : matière + thèmes */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-sm dark:bg-black/35 overflow-hidden">
                  <div className="text-xs text-muted-foreground">Matière non achetée (même niveau)</div>
                  <div className="mt-1 text-lg font-semibold">Découvrir une autre matière</div>

                  <div className="mt-3 overflow-hidden rounded-xl border bg-white/60 dark:bg-black/25">
                    <img src={ASSETS.lockedSubject} alt="" className="h-44 w-full object-cover" />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Exemple : <span className="font-medium">Physique-Chimie</span></div>
                    <Link href="/panier?tab=subjects" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">
                      Obtenir
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-sm dark:bg-black/35">
                  <div className="text-xs text-muted-foreground">Thèmes non débloqués</div>
                  <div className="mt-1 text-lg font-semibold">Personnalise ton univers</div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <img src={ASSETS.skin1} alt="" className="h-24 w-full rounded-xl border object-cover bg-white/60" />
                    <img src={ASSETS.skin2} alt="" className="h-24 w-full rounded-xl border object-cover bg-white/60" />
                    <img src={ASSETS.skin3} alt="" className="h-24 w-full rounded-xl border object-cover bg-white/60" />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Débloque de nouveaux thèmes</div>
                    <Link href="/panier?tab=themes" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">
                      Obtenir
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/" className="text-xs text-muted-foreground underline underline-offset-4">Fermer</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dev assets: public/home-dashboard/*
            Prod: URLs Vercel Blob (DB) */}
      </div>
    </div>
  )
}
