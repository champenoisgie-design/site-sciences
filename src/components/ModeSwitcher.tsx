'use client'
import { useMode } from './ModeProvider'
const LABELS = { normal:'Normal', tdah:'TDAH', dys:'DYS', tsa:'TSA', hpi:'HPI' } as const

export default function ModeSwitcher(){
  const { mode, setMode } = useMode()
  return (
    <div className="card">
      <div className="text-sm text-muted mb-2">Mode d’adaptation</div>
      <select className="btn w-full" value={mode} onChange={e=> setMode(e.target.value as any)}>
        {Object.entries(LABELS).map(([k,v])=> <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  )
}
