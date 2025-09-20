'use client'
import { useState } from 'react'
export default function Checklist({ items = ["Finir 2 quiz","Regarder 1 vidéo","Faire 1 pause active"] }:{items?: string[]}){
  const [done, setDone] = useState<boolean[]>(items.map(()=>false))
  return (
    <div className="card">
      <div className="font-semibold mb-2">Objectifs du jour</div>
      <ul className="space-y-2">
        {items.map((it, i)=> (
          <li key={i} className="flex items-center gap-2">
            <input type="checkbox" checked={done[i]} onChange={()=> setDone(d=> d.map((v,idx)=> idx===i? !v : v))} />
            <span className={done[i] ? "line-through text-muted" : ""}>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
