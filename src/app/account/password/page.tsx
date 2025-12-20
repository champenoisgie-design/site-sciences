'use client'

import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage('❌ Les nouveaux mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    setLoading(false)
    if (res.ok) {
      setMessage('✅ Mot de passe changé avec succès !')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      const data = await res.json()
      setMessage(
        `❌ ${data.error || 'Erreur lors du changement de mot de passe.'}`,
      )
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Changer mon mot de passe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Mot de passe actuel"
          value={currentPassword}
          onChange={setCurrentPassword}
          required
        />
        <PasswordInput
          label="Nouveau mot de passe"
          value={newPassword}
          onChange={setNewPassword}
          required
        />
        <PasswordInput
          label="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'En cours...' : 'Changer le mot de passe'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}


<section className="mt-8 rounded-2xl border p-5 bg-emerald-50/70">
  <h2 className="text-sm font-semibold mb-1">Espace parents</h2>
  <p className="text-sm text-muted-foreground">
    Suivez la progression, le temps hebdomadaire et les priorités de révision de votre enfant.
  </p>
  <div className="mt-3 flex items-center gap-3">
    <a href="/parents" className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 active:scale-[0.99] transition">
      Accéder à l’espace parents
    </a>
    <a href="/faq" className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground">
      En savoir plus
    </a>
  </div>
</section>

