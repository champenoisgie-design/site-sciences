'use client'

import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('❌ Les mots de passe ne correspondent pas.')
      return
    }
    // TODO: appel API reset
    console.log('Reset password:', { newPassword })
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Réinitialiser le mot de passe
      </h1>
      <form onSubmit={handleReset} className="space-y-4">
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
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Réinitialiser
        </button>
      </form>
    </div>
  )
}
