'use client'

import { useEffect, useRef } from 'react'

export default function EntitlementsSync() {
  const once = useRef(false)
  useEffect(() => {
    if (once.current) return
    once.current = true
    fetch('/api/entitlements/sync', { method: 'POST' }).catch(() => {})
  }, [])
  return null
}
