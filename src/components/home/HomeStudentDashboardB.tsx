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

type BillingSubscription = {
  id: string
  userId: string
  plan: string
  grade: string
  subjectsJson: string
  status: string
  stripeSubscriptionId: string
  currentPeriodEnd: string | null
  createdAt: string
  updatedAt: string
}

type BillingSubResponse = { ok: boolean; subscription: BillingSubscription | null }

type AccessStatus = { kind: 'FULL' | 'TRIAL' | 'PAYWALL' | 'GUEST' | 'EXPIRED'; endsAt?: string; grade?: string; subject?: string; endedAt?: string; lastPlan?: string }

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

export default function HomeStudentDashboardB() {
  const [me, setMe] = useState<MeResponse>({ user: null })
  const [loaded, setLoaded] = useState(false)
  const [access, setAccess] = useState<AccessStatus | null>(null)
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then((data) => { if (mounted) { setMe(data); setLoaded(true) } })
      .catch(() => { if (mounted) setLoaded(true) })
    
    // Subscription (real, from Prisma)
    fetch('/api/billing/subscription', { cache: 'no-store' })
      .then(r => r.json())
      .then((j: BillingSubResponse) => { if (mounted) setSubscription(j?.subscription ?? null) })
      .catch(() => {})

    // Access status (paywall/trial/full)
    fetch('/api/access/status', { cache: 'no-store' })
      .then(r => r.json())
      .then((j) => {
        if (!mounted) return
        const a = j?.access ?? null
        setAccess(a)
        if (a?.kind === 'PAYWALL' || a?.kind === 'EXPIRED') setShowPaywall(true)
      })
      .catch(() => {})
return () => { mounted = false }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [])

  const user = me.user

  const subSubjects = useMemo(() => {
    if (!subscription?.subjectsJson) return ''
    try {
      const j = JSON.parse(subscription.subjectsJson || '{}')
      return (j?.subjects || '') as string
    } catch {
      return ''
    }
  }, [subscription?.subjectsJson])

  const purchasedSubjects = useMemo(() => {
    const raw = subSubjects || ''
    const parts = raw.split('|').map(x => x.trim()).filter(Boolean)
    return parts.map(p => {
      const i = p.indexOf(':')
      if (i <= 0) return null
      const level = p.slice(0, i).trim()
      const subject = p.slice(i + 1).trim()
      if (!level || !subject) return null
      return { key: p, level, subject }
    }).filter(Boolean) as Array<{ key: string; level: string; subject: string }>
  }, [subSubjects])

// Hooks safe
  const trial = useMemo(() => {
    const endsAt = user?.trialEndsAt
    if (!endsAt) return { active: false as const, remainingMs: 0 }
    const end = new Date(endsAt).getTime()
    const remainingMs = end - now
    return { active: remainingMs > 0, remainingMs }
  }, [user?.trialEndsAt, now])

  // Mock data (à brancher Prisma ensuite)
  const xpCurrent = 1200
  const xpGoal = 2000
  const xpPct = Math.round((xpCurrent / xpGoal) * 100)
  const dailyProgress = 55

  // Assets (vision: Vercel Blob)
  // Aujourd’hui: placeholders locaux (dev). Demain: URLs Blob en DB.
  const ASSETS = {
    heroBg: '/home-dashboard-b/hero-bg.jpg',
    heroSticker1: '/home-dashboard-b/sticker-1.png',
    heroSticker2: '/home-dashboard-b/sticker-2.png',
    avatar: '/home-dashboard-b/avatar.png',

    training1: '/home-dashboard-b/training-1.png',
    training2: '/home-dashboard-b/training-2.png',

    pack1: '/home-dashboard-b/pack-1.jpg',
    pack2: '/home-dashboard-b/pack-2.jpg',

    lockedSubject: '/home-dashboard-b/locked-subject.jpg',

    skin1: '/home-dashboard-b/skin-1.png',
    skin2: '/home-dashboard-b/skin-2.png',
    skin3: '/home-dashboard-b/skin-3.png',
  } as const

  // --- Élèves (UI ready) ---
  // Aujourd’hui: 1 élève (compte), demain: students[] via DB (pack famille)
  const students = useMemo(() => {
    const baseName = user?.name ?? 'Élève'
    // id stable: on utilisera StudentProfile.id plus tard
    return user ? [{ id: user.id, name: baseName }] : []
  }, [user?.id, user?.name])

  const [selectedStudentId, setSelectedStudentId] = useState<string>('')

  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>('')

  useEffect(() => {
    if (!loaded || !user) return
    try {
      const saved = localStorage.getItem('selectedStudentId')
      if (saved && students.some(s => s.id == saved)) {
        setSelectedStudentId(saved)
      } else {
        setSelectedStudentId(students[0]?.id ?? '')
      }
    } catch {
      setSelectedStudentId(students[0]?.id ?? '')
    }
  }, [loaded, user?.id, students])

  useEffect(() => {
    if (!selectedStudentId) return
    try { localStorage.setItem('selectedStudentId', selectedStudentId) } catch {}
  }, [selectedStudentId])

  const selectedStudent = students.find(s => s.id === selectedStudentId) ?? students[0]

  const selectedSubject = purchasedSubjects.find(x => x.key === selectedSubjectKey) ?? purchasedSubjects[0] ?? null

  if (!loaded) return null
  if (!user) return null

  return (
    <main className="min-h-screen bg-background text-foreground">
      {showPaywall ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl dark:bg-zinc-900">
            <div className="text-xs font-semibold text-rose-600">
  {access?.kind === 'EXPIRED' ? "ABONNEMENT EXPIRE" : "FIN D'ESSAI"}
</div>
<div className="mt-2 text-2xl font-bold">
  {access?.kind === 'EXPIRED' ? "Ton abonnement a expiré" : "Ton accès est bloqué"}
</div>
            <p className="mt-2 text-sm text-muted-foreground">
Pour continuer, choisis une formule (matières, chapitres, thèmes). Paiement protégé par PIN parents.
              {access?.kind === 'EXPIRED' && access?.endedAt ? (
                <span className="block mt-2">
                  Fin le : <span className="font-semibold">{new Date(access.endedAt).toLocaleString("fr-FR")}</span>
                </span>
              ) : null}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/tarifs" className="rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700">
                {access?.kind === 'EXPIRED' ? "Renouveler l’abonnement" : "Voir les tarifs"}
              </Link>
              <Link href="/panier?tab=subjects" className="rounded-xl border px-5 py-3 font-semibold hover:bg-accent">
                Aller au panier
              </Link>
              <button
                onClick={() => setShowPaywall(false)}
                className="rounded-xl border px-5 py-3 font-semibold hover:bg-accent"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* HERO immersif */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-background" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium backdrop-blur dark:bg-black/40">
                ✅ Élève connecté
                <span className="mx-2 opacity-50">•</span>
                <span className="opacity-80">Élève :</span>
                <select
                  className="ml-2 rounded-lg border bg-white/70 px-2 py-1 text-xs font-semibold backdrop-blur dark:bg-black/35"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>

                {purchasedSubjects.length > 0 ? (
                  <>
                    <span className="mx-2 opacity-50">•</span>
                    <span className="opacity-80">Matière :</span>
                    <select
                      className="ml-2 rounded-lg border bg-white/70 px-2 py-1 text-xs font-semibold backdrop-blur dark:bg-black/35"
                      value={selectedSubjectKey}
                      onChange={(e) => setSelectedSubjectKey(e.target.value)}
                    >
                      {purchasedSubjects.map((it) => (
                        <option key={it.key} value={it.key}>
                          {it.level} — {it.subject}
                        </option>
                      ))}
                    </select>
                  </>
                ) : null}

                {subscription ? (
                  <span className="ml-2 rounded-full bg-emerald-600/15 px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                    Abonnement actif : {subscription.plan} — {subscription.grade}{subSubjects ? ` • ${subSubjects}` : ""}
                  </span>
                ) : null}

                {trial.active ? (
                  <span className="opacity-80">
                    • Essai : {formatRemaining(trial.remainingMs)}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Bienvenue{selectedStudent?.name ? ` ${selectedStudent.name}` : ''} — {selectedSubject?.level ?? (user.trialGrade ?? '—')} • {selectedSubject?.subject ?? (user.trialSubject ?? '—')}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={
                    selectedSubject?.level && selectedSubject?.subject
                      ? `/exercices?grade=${encodeURIComponent(selectedSubject.level)}&subject=${encodeURIComponent(selectedSubject.subject)}`
                      : "/exercices"
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700"
                >
                  Continuer
                </Link>
                <Link
                  href="/compte"
                  className="inline-flex items-center justify-center rounded-xl bg-white/70 px-5 py-3 font-semibold backdrop-blur hover:bg-white/90 dark:bg-black/40 dark:hover:bg-black/55"
                >
                  Mon compte
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img src={ASSETS.heroSticker1} alt="" className="h-16 w-16 rounded-2xl border bg-white/60 object-cover" />
              <img src={ASSETS.heroSticker2} alt="" className="h-16 w-16 rounded-2xl border bg-white/60 object-cover" />
            </div>
          </div>

          {/* Défi du jour + XP (cards) */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur dark:bg-black/35">
              <div className="text-xs text-muted-foreground">Défi du jour</div>
              <div className="mt-1 text-xl font-semibold">Vitesses & unités</div>
              <div className="mt-4"><ProgressBar value={dailyProgress} /></div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Progression</div>
                <div className="text-sm font-semibold">{dailyProgress}%</div>
              </div>
              <div className="mt-4">
                <Link href="/exercices" className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-white font-semibold hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
                  Lancer le défi
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur dark:bg-black/35">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">XP progression</div>
                  <div className="mt-1 text-lg font-semibold">{xpCurrent} / {xpGoal}</div>
                </div>
                <img src={ASSETS.avatar} alt="" className="h-12 w-12 rounded-xl border bg-white/60 object-cover" />
              </div>
              <div className="mt-3"><ProgressBar value={xpPct} /></div>
              <div className="mt-2 text-xs text-muted-foreground">
                Encore <span className="font-semibold">{xpGoal - xpCurrent} XP</span> pour débloquer l’évolution suivante.
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/progression" className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-accent">
                  Progression
                </Link>
                <Link href="/tarifs" className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-accent">
                  Tarifs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corps dashboard */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Entraînement semaine */}
          <div className="md:col-span-2 rounded-2xl border bg-white/70 p-5 backdrop-blur dark:bg-black/35">
            <div className="text-xs text-muted-foreground">Recommandé pour toi</div>
            <div className="mt-1 text-lg font-semibold">Entraînement de semaine</div>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-3 rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                <img src={ASSETS.training1} alt="" className="h-12 w-12 rounded-lg border object-cover bg-white/60" />
                <div className="flex-1">
                  <div className="font-medium">Conversions express</div>
                  <div className="text-xs text-muted-foreground">10 min • +250 XP</div>
                </div>
                <Link href="/exercices" className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">
                  Reprendre
                </Link>
              </div>

              <div className="flex items-center gap-3 rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                <img src={ASSETS.training2} alt="" className="h-12 w-12 rounded-lg border object-cover bg-white/60" />
                <div className="flex-1">
                  <div className="font-medium">Quiz unités</div>
                  <div className="text-xs text-muted-foreground">8 min • +180 XP</div>
                </div>
                <Link href="/exercices" className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700">
                  Reprendre
                </Link>
              </div>
            </div>
          </div>

          {/* Packs à débloquer */}
          <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur dark:bg-black/35">
            <div className="text-xs text-muted-foreground">À débloquer</div>
            <div className="mt-1 text-lg font-semibold">Packs & chapitres</div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                <img src={ASSETS.pack1} alt="" className="h-20 w-full rounded-lg border object-cover bg-white/60" />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Pack “Vitesse++”</div>
                  <Link href="/panier?tab=chapters" className="text-sm font-semibold text-emerald-700 underline underline-offset-4">
                    Obtenir
                  </Link>
                </div>
              </div>

              <div className="rounded-xl border bg-white/60 p-3 dark:bg-black/25">
                <img src={ASSETS.pack2} alt="" className="h-20 w-full rounded-lg border object-cover bg-white/60" />
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

        {/* Bas : matière non achetée + skins */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur dark:bg-black/35">
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

          <div className="rounded-2xl border bg-white/70 p-5 backdrop-blur dark:bg-black/35">
            <div className="text-xs text-muted-foreground">Skins / Thèmes non débloqués</div>
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
      </section>

      {/* Note dev: images locales dans public/home-dashboard-b/
          Prod: URLs Vercel Blob en DB */}
    </main>
  )
}
