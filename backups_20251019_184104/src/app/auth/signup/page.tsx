'use client'

import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('❌ Les mots de passe ne correspondent pas.')
      return
    }
    // TODO: appel API signup
    console.log('Signup:', { email, password })
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Inscription</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <PasswordInput
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          required
        />

        <PasswordInput
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          S'inscrire
        </button>
      </form>
    </div>
  )
}
