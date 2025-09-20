'use client'
import { useState } from 'react'

export default function Checklist({ items }: { items?: string[] }) {
  const defaults = items ?? ['Finir 2 quiz', 'Regarder 1 vidéo', 'Faire 1 pause active']
  const [checked, setChecked] = useState<boolean[]>(defaults.map(() => false))

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Checklist</h3>
      <ul className="space-y-2">
        {defaults.map((txt, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)))}
            />
            <span className={checked[i] ? 'line-through text-muted' : ''}>{txt}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
