'use client'
import { useState } from 'react'

export default function Page({ params }: { params: { token: string } }) {
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setMsg(null)
    setLoading(true)
    const fd = new FormData(form)
    const body = Object.fromEntries(fd.entries())
    try {
      const r = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, token: params.token }),
      })
      if (!r.ok) throw new Error(await r.text())
      setMsg('Mot de passe mis à jour ✔. Vous pouvez vous connecter.')
      form.reset()
    } catch (e: any) {
      setMsg(e?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h1>
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border p-4">
        <div>
          <label className="text-sm">Nouveau mot de passe</label>
          <div className="mt-1 flex items-stretch gap-2">
            <input
              name="password"
              type={show ? 'text' : 'password'}
              required
              minLength={8}
              className="w-full rounded border bg-transparent px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="rounded border px-2 text-xs"
            >
              {show ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>
        <button
          disabled={loading}
          className="rounded bg-zinc-900 text-white px-4 py-2 text-sm dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? '...' : 'Mettre à jour'}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </section>
  )
}
