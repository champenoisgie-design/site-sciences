'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PasswordInput from '@/components/PasswordInput'

export default function LoginPage() {
  const r = useRouter()
  const sp = useSearchParams()

  const [email, setEmail] = useState(sp.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, remember }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const code = data?.error || 'UNKNOWN'
        if (code === 'missing') setError('Email et mot de passe requis.')
        else if (code === 'invalid_credentials') setError('Identifiants invalides.')
        else if (code === 'PASSWORD_NOT_SET') setError('Ce compte a été créé sans mot de passe. Recrée un compte ou utilise la connexion par code (à venir).')
        else setError(`Erreur: ${code}`)
        return
      }

      r.push('/')
    } catch {
      setError('Impossible de se connecter. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Connexion</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <PasswordInput
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          required
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Rester connecté
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
