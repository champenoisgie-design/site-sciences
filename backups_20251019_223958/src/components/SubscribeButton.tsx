'use client'
import { useState } from 'react'

type Plan = 'BRONZE' | 'GOLD' | 'PLATINE'
type Kind = 'SUBJECT' | 'PACK3'

export default function SubscribeButton({
  plan,
  kind = 'SUBJECT',
  subject,
  grade,
  packPrice, // en euros (nombre)
  disabled,
  label,
}: {
  plan: Plan
  kind?: Kind
  subject?: string
  grade?: string
  packPrice?: number
  disabled?: boolean
  label?: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (disabled || loading) return
    setLoading(true)
    try {
      const r = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, kind, subject, grade, packPrice }),
      })
      const data = await r.json()
      if (!r.ok) return alert(data?.error ?? 'Erreur')
      if (data.url) window.location.href = data.url
    } catch {
      alert('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || !!disabled}
      className="mt-4 rounded-xl px-4 py-2 border shadow-sm hover:shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Redirection…' : (label ?? "S'abonner")}
    </button>
  )
}
