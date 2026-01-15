'use client'

import { useState } from 'react'
import { useParentPinModal } from "@/components/parent-pin/useParentPinModal";
import { fetchWithParentPinRetry } from "@/components/parent-pin/fetchWithParentPinRetry";

type Plan = 'BRONZE' | 'GOLD' | 'PLATINE'
type Kind = 'SUBJECT' | 'PACK3'

type Props = {
  plan: Plan
  kind: Kind
  subject?: string
  grade?: string
  packPrice?: number
  disabled?: boolean
  label?: string
  className?: string
}

export default function SubscribeButton({
  plan,
  kind,
  subject,
  grade,
  packPrice,
  disabled,
  label,
  className,
}: Props) {
  const [loading, setLoading] = useState(false)
  const { open: openParentPin, ParentPinModal } = useParentPinModal();

  async function handleClick() {
    if (disabled || loading) return
    setLoading(true)

    try {
      const res = await fetchWithParentPinRetry(
        '/api/checkout/session',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ plan, kind, subject, grade, packPrice }),
        },
        openParentPin
      )

      const j = await res.json().catch(() => ({}))

      if (!res.ok) {
        console.error('checkout/session error', j)
        alert(j?.error || 'Erreur checkout')
        return
      }

      const url = j?.url
      if (typeof url === 'string' && url.length > 0) {
        window.location.href = url
        return
      }

      alert('Checkout: URL manquante')
    } catch (e: any) {
      console.error(e)
      alert(e?.message || 'Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={className}
      >
        {loading ? 'Redirection…' : (label ?? "S'abonner")}
      </button>

      {ParentPinModal}
    </>
  )
}
