'use client'
import { useMode } from './ModeProvider'

const LABELS: Record<string, string> = {
  normal: 'Normal',
  tdah: 'TDAH',
  dys: 'DYS',
  tsa: 'TSA',
  hpi: 'HPI',
}

export default function ModeSwitcher() {
  const { mode, setMode } = useMode()
  return (
    <div className="card space-y-2">
      <div className="text-sm text-muted">Mode d’apprentissage</div>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as any)}
        className="btn w-full"
        aria-label="Choisir un mode"
      >
        {Object.keys(LABELS).map((k) => (
          <option key={k} value={k}>{LABELS[k]}</option>
        ))}
      </select>
    </div>
  )
}
