// @ts-nocheck
'use client'
import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'

export default function ChangePasswordCard() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())
    try {
      const r = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        let err = 'Erreur'
        try {
          err = (await r.json()).error || err
        } catch {}
        throw new Error(err)
      }
      setMsg(
        'Mot de passe mis à jour ✔. Toutes vos autres sessions sont invalidées.',
      )
      ;(e.currentTarget as HTMLFormElement).reset()
    } catch (e: any) {
      setMsg(e?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border p-5">
      <h2 className="text-lg font-semibold mb-3">Changer le mot de passe</h2>
      <form className="grid gap-3" onSubmit={onSubmit} noValidate>
        <div>
          <label className="text-sm">Mot de passe actuel</label>
          <PasswordInput
            name="currentPassword"
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className="text-sm">Nouveau mot de passe (min. 8)</label>
          <PasswordInput
            name="newPassword"
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <button
          disabled={loading}
          className="rounded bg-zinc-900 text-white px-4 py-2 text-sm dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? '...' : 'Mettre à jour'}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <p className="mt-2 text-xs text-zinc-500">
        Par sécurité, vos autres appareils seront déconnectés.
      </p>
    </div>
  )
}