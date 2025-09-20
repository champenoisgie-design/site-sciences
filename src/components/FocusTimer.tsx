'use client'
import { useEffect, useState } from 'react'
export default function FocusTimer({ minutes=5 }: { minutes?: number }){
  const [sec, setSec] = useState(minutes*60)
  useEffect(()=>{ const t = setInterval(()=> setSec(s=> s>0? s-1 : 0), 1000); return ()=> clearInterval(t) },[])
  const m = Math.floor(sec/60).toString().padStart(2,'0')
  const s = (sec%60).toString().padStart(2,'0')
  return (
    <div className="card flex items-center justify-between">
      <div className="text-sm text-muted">Minuteur</div>
      <div className="text-xl font-mono">{m}:{s}</div>
      <button className="btn" onClick={()=> setSec(minutes*60)}>Reset</button>
    </div>
  )
}
