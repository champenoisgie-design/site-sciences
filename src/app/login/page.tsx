"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [remember, setRemember] = useState(true)
  const [showPw, setShowPw] = useState(false)
  const r = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setMsg(null)
    setLoading(true)
    const fd = new FormData(form)
    const body = Object.fromEntries(fd.entries())
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, remember }),
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg(mode === 'login' ? 'Connecté ✔' : 'Compte créé ✔')
      r.refresh()
      r.push('/')
    } catch (err: any) {
      setMsg(err?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {mode === 'login' ? 'Connexion' : 'Créer un compte'}
      </h1>
      <div className="mb-3 text-sm">
        {mode === 'login' ? (
          <>
            Pas encore de compte ?{' '}
            <button className="underline" onClick={() => setMode('register')}>
              Créer un compte
            </button>
          </>
        ) : (
          <>
            Déjà inscrit ?{' '}
            <button className="underline" onClick={() => setMode('login')}>
              Se connecter
            </button>
          </>
        )}
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border p-4">
        {mode === 'register' && (
          <div>
            <label className="text-sm">Nom</label>
            <input
              name="name"
              className="mt-1 w-full rounded border bg-transparent px-3 py-2"
            />
          </div>
        )}
        <div>
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm">Mot de passe</label>
          <div className="mt-1 flex items-stretch gap-2">
            <input
              name="password"
              type={showPw ? 'text' : 'password'}
              required
              minLength={8}
              className="w-full rounded border bg-transparent px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="rounded border px-2 text-xs"
            >
              {showPw ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Se souvenir de moi (90 jours)
        </label>
        <button
          disabled={loading}
          className="rounded bg-zinc-900 text-white px-4 py-2 text-sm dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading
            ? '...'
            : mode === 'login'
              ? 'Se connecter'
              : 'Créer le compte'}
        </button>
        {mode === 'login' && (
          <a href="/forgot" className="text-xs underline">
            Mot de passe oublié ?
          </a>
        )}
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </section>
  )
}
