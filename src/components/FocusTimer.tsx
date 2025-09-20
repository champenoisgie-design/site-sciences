'use client'
import { useEffect, useState } from 'react'

export default function FocusTimer({ minutes = 5 }: { minutes?: number }) {
  const total = minutes * 60
  const [s, setS] = useState(total)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [running])

  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')

  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-sm text-muted">Minuteur de focus</div>
        <div className="text-lg font-semibold tabular-nums">{mm}:{ss}</div>
      </div>
      <div className="flex gap-2">
        {!running ? (
          <button className="btn-primary" onClick={() => setRunning(true)}>Démarrer</button>
        ) : (
          <button className="btn" onClick={() => setRunning(false)}>Pause</button>
        )}
        <button className="btn" onClick={() => { setRunning(false); setS(total) }}>Reset</button>
      </div>
    </div>
  )
}
