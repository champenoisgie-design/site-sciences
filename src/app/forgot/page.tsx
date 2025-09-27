"use client"
import { useState } from 'react'

export default function Page() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error' | 'sending'>(
    'idle',
  )
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    try {
      const r = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error()
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }
  return (
    <section className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mot de passe oublié</h1>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border p-4">
        <div>
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border bg-transparent px-3 py-2"
          />
        </div>
        <button
          disabled={status === 'sending'}
          className="rounded bg-zinc-900 text-white px-4 py-2 text-sm dark:bg-zinc-100 dark:text-zinc-900"
        >
          {status === 'sending' ? '...' : 'Recevoir le lien'}
        </button>
        {status === 'ok' && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Lien envoyé (voir console serveur) ✔
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Erreur, réessayez.
          </p>
        )}
      </form>
    </section>
  )
}
