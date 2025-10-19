'use client'
import { useState } from 'react'

export default function ChangePasswordForm() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget // <-- on capture le form AVANT les await
    setMsg(null)
    setLoading(true)
    const fd = new FormData(form)
    const body = Object.fromEntries(fd.entries())
    try {
      const r = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error(await r.text())
      setMsg('Mot de passe mis à jour ✔')
      form.reset() // <-- sûr, on a gardé la référence
    } catch (e: any) {
      setMsg(e?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border p-4 max-w-md"
    >
      <div>
        <label className="text-sm">Mot de passe actuel</label>
        <div className="mt-1 flex items-stretch gap-2">
          <input
            name="oldPassword"
            type={showOld ? 'text' : 'password'}
            required
            className="w-full rounded border bg-transparent px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setShowOld((s) => !s)}
            className="rounded border px-2 text-xs"
          >
            {showOld ? 'Masquer' : 'Afficher'}
          </button>
        </div>
      </div>
      <div>
        <label className="text-sm">Nouveau mot de passe</label>
        <div className="mt-1 flex items-stretch gap-2">
          <input
            name="newPassword"
            type={showNew ? 'text' : 'password'}
            minLength={8}
            required
            className="w-full rounded border bg-transparent px-3 py-2"
          />
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="rounded border px-2 text-xs"
          >
            {showNew ? 'Masquer' : 'Afficher'}
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
  )
}
