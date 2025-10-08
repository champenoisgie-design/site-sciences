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
