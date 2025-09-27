"use client"
import { useMode } from './ModeProvider'
import type { UIMode } from './ModeProvider'
import React from 'react'

const LABELS: Record<UIMode, string> = {
  normal: 'Normal',
  tdah: 'TDAH',
  dys: 'DYS',
  tsa: 'TSA',
  hpi: 'HPI',
}

export default function ModeSwitcher() {
  const { mode, setMode } = useMode()

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as UIMode
    setMode(next)
  }

  return (
    <div className="card space-y-2">
      <div className="text-sm text-muted">Mode d’apprentissage</div>
      <select
        value={mode}
        onChange={onChange}
        className="btn w-full"
        aria-label="Choisir un mode"
      >
        {(Object.keys(LABELS) as UIMode[]).map((k) => (
          <option key={k} value={k}>
            {LABELS[k]}
          </option>
        ))}
      </select>
    </div>
  )
}
