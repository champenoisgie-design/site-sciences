'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const GRADES = ['6e', '5e', '4e', '3e', '2nde', '1re', 'Terminale']
const SUBJECTS = [
  { key: 'maths', label: 'Maths' },
  { key: 'francais', label: 'Français' },
  { key: 'histoire', label: 'Histoire' },
  { key: 'geo', label: 'Géographie' },
  { key: 'sciences', label: 'Sciences' },
]

function normalizeEmail(v: string) {
  return v.trim().toLowerCase()
}

export default function SignupPage() {
  const r = useRouter()

  const [emailParent, setEmailParent] = useState('')
  const [prenomEnfant, setPrenomEnfant] = useState('')
  const [grade, setGrade] = useState(GRADES[0])
  const [subject, setSubject] = useState(SUBJECTS[0].key)

  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (!emailParent.trim()) return false
    if (!prenomEnfant.trim()) return false
    if (!grade) return false
    if (!subject) return false
    if (!/^\d{4}$/.test(pin)) return false
    if (pin !== pinConfirm) return false
    if (String(password).length < 8) return false
    if (password !== passwordConfirm) return false
    if (!acceptTerms || !acceptPrivacy) return false
    return true
  }, [emailParent, prenomEnfant, grade, subject, pin, pinConfirm, password, passwordConfirm, acceptTerms, acceptPrivacy])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const payload = {
      emailParent: normalizeEmail(emailParent),
      prenomEnfant: prenomEnfant.trim(),
      grade,
      subject,
      pin,
      pinConfirm,
      password,
      passwordConfirm,
      acceptTerms,
      acceptPrivacy,
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const code = data?.error || 'UNKNOWN'
        if (code === 'EMAIL_IN_USE') setError('Cet email est déjà utilisé.')
        else if (code === 'PIN_MISMATCH') setError('Les deux PIN ne correspondent pas.')
        else if (code === 'PIN_INVALID') setError('Le PIN doit contenir exactement 4 chiffres.')
        else if (code === 'CONSENT_REQUIRED') setError('Tu dois accepter les CGU et la politique de confidentialité.')
        else if (code === 'MISSING_FIELDS') setError('Tous les champs sont requis.')
        else setError(`Erreur: ${code}`)
        return
      }

      r.push('/')
    } catch {
      setError('Impossible de créer le compte. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2">Créer un compte parent</h1>
      <p className="text-sm text-zinc-600 mb-5">
        Essai gratuit 3 jours • 1 niveau + 1 matière • Décisions parentales protégées par PIN
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email parent</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={emailParent}
            onChange={(e) => setEmailParent(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Prénom de l’enfant</label>
          <input
            className="w-full border rounded p-2"
            value={prenomEnfant}
            onChange={(e) => setPrenomEnfant(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Niveau</label>
          <select
            className="w-full border rounded p-2"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Matière (unique)</label>
          <select
            className="w-full border rounded p-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {SUBJECTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded border p-3 space-y-3">
  <div className="text-sm font-medium">Mot de passe</div>
  <div>
    <label className="block text-sm">Créer un mot de passe</label>
    <input
      type="password"
      className="w-full border rounded p-2"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      minLength={8}
      required
      autoComplete="new-password"
    />
  </div>
  <div>
    <label className="block text-sm">Confirmer le mot de passe</label>
    <input
      type="password"
      className="w-full border rounded p-2"
      value={passwordConfirm}
      onChange={(e) => setPasswordConfirm(e.target.value)}
      minLength={8}
      required
      autoComplete="new-password"
    />
  </div>
</div>

<div className="rounded border p-3 space-y-3">
          <div className="text-sm font-medium">PIN Parents (4 chiffres)</div>

          <div>
            <label className="block text-sm">Créer un PIN</label>
            <input
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              className="w-full border rounded p-2"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
              placeholder="0000"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Confirmer le PIN</label>
            <input
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              className="w-full border rounded p-2"
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
              placeholder="0000"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            J’accepte les CGU
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptPrivacy}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
            />
            J’accepte la politique de confidentialité
          </label>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  )
}
