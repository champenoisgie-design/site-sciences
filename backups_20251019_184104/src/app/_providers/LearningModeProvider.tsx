'use client'

import { useEffect, useState } from 'react'
import type { LearningMode } from '@/lib/learning-mode'

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[2]) : null
}

export default function LearningModeProvider({
  cookieName = 'learningMode',
  children,
}: {
  cookieName?: string
  children: React.ReactNode
}) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const fromCookie = (getCookie(cookieName) as LearningMode) || 'normal'
    document.documentElement.setAttribute('data-learning-mode', fromCookie)
    setHydrated(true)
  }, [cookieName])

  // Optionnel : écoute les changements envoyés par le switcher
  useEffect(() => {
    const onChanged = (e: any) => {
      const v = e?.detail as LearningMode
      if (v) {
        document.documentElement.setAttribute('data-learning-mode', v)
      }
    }
    window.addEventListener('learning-mode:changed', onChanged as any)
    return () =>
      window.removeEventListener('learning-mode:changed', onChanged as any)
  }, [])

  return <>{children}</>
}
