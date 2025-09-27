"use client"
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Selection, School, AnyGrade, Subject } from '@/lib/school'
import { gradesBySchool } from '@/lib/school'

type Ctx = {
  selection: Selection
  setSchool: (s: School | undefined) => void
  setGrade: (g: AnyGrade | undefined) => void
  setSubject: (s: Subject | undefined) => void
  reset: () => void
}

const C = createContext<Ctx | undefined>(undefined)

export function useSelection() {
  const v = useContext(C)
  if (!v) throw new Error('useSelection must be used within SelectionProvider')
  return v
}

const KEY = '__site_sciences_selection__'

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>({})

  // Charger depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setSelection(JSON.parse(raw))
    } catch {}
  }, [])

  // Persister
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(selection))
    } catch {}
  }, [selection])

  // Réinitialiser grade si l'école change
  function setSchool(s: School | undefined) {
    setSelection((prev) => {
      const next = { ...prev, school: s }
      if (s && prev.grade && !gradesBySchool[s].includes(prev.grade)) {
        next.grade = undefined
      }
      return next
    })
  }

  function setGrade(g: AnyGrade | undefined) {
    setSelection((prev) => ({ ...prev, grade: g }))
  }

  function setSubject(s: Subject | undefined) {
    setSelection((prev) => ({ ...prev, subject: s }))
  }

  function reset() {
    setSelection({})
  }

  const value = useMemo(
    () => ({ selection, setSchool, setGrade, setSubject, reset }),
    [selection],
  )
  return <C.Provider value={value}>{children}</C.Provider>
}
