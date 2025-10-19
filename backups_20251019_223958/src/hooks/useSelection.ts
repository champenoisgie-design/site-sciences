'use client'
import { useEffect, useState } from 'react'

export type StageKey = 'college' | 'lycee'
type Sel = { stage: StageKey; grade: string; subject: string }

const STORAGE_KEY = 'site_selection'

export function useSelection(initial?: Partial<Sel>) {
  const [stage, setStage] = useState<StageKey>(initial?.stage ?? 'lycee')
  const [grade, setGrade] = useState<string>(initial?.grade ?? '2nde')
  const [subject, setSubject] = useState<string>(
    initial?.subject ?? 'Physique-Chimie',
  )

  // Monter : lire URL (?stage/&grade/&subject) puis localStorage
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search)
      const s = (sp.get('stage') as StageKey) || null
      const g = sp.get('grade')
      const sb = sp.get('subject')

      const fromLS = localStorage.getItem(STORAGE_KEY)
      const saved: Partial<Sel> = fromLS ? JSON.parse(fromLS) : {}

      setStage(s ?? (saved.stage as StageKey) ?? stage)
      setGrade(g ?? saved.grade ?? grade)
      setSubject(sb ?? saved.subject ?? subject)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persister
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stage, grade, subject }),
      )
    } catch {}
  }, [stage, grade, subject])

  return { stage, setStage, grade, setGrade, subject, setSubject }
}
