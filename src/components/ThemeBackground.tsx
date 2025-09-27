"use client"
import { useEffect } from 'react'
import { useSelection } from '@/components/SelectionProvider'

/**
 * Applique un data-attribute sur <html> pour basculer le thème CSS
 * selon la matière sélectionnée (Maths / Physique-Chimie / SVT).
 */
export default function ThemeBackground() {
  const { selection } = useSelection()
  useEffect(() => {
    const el = document.documentElement
    const subj = selection.subject ?? 'none'
    el.setAttribute('data-subject', subj)
    return () => {
      // rien
    }
  }, [selection.subject])
  return null
}
