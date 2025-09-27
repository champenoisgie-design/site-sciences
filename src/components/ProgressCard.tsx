"use client"
import { useEffect, useState } from 'react'
import { useSelection } from '@/components/SelectionProvider'

type Item = { subject: string; grade: string; xp: number; badges?: string[] }

export default function ProgressCard() {
  const { selection } = useSelection()
  const subject = selection.subject
  const grade = selection.grade
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!subject || !grade) {
      setItem(null)
      return
    }
    setLoading(true)
    const url = `/api/progress?subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(grade)}`
    fetch(url, { cache: 'no-store', headers: { 'cache-control': 'no-store' } })
      .then((r) => r.json())
      .then(
        (d) =>
          mounted &&
          setItem(
            (d.items && d.items[0]) || { subject, grade, xp: 0, badges: [] },
          ),
      )
      .catch(() => mounted && setItem({ subject, grade, xp: 0, badges: [] }))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [subject, grade])

  if (!subject || !grade) return null

  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-sm font-semibold">
        Progression — {subject} • {grade}
      </h3>
      {loading ? (
        <p className="mt-2 text-xs text-zinc-500">Chargement…</p>
      ) : !item ? (
        <p className="mt-2 text-xs text-zinc-500">Aucune progression.</p>
      ) : (
        <>
          <p className="mt-2 text-sm">
            XP : <strong>{item.xp}</strong>
          </p>
          <p className="mt-1 text-sm">
            Badges :{' '}
            {item.badges && item.badges.length ? item.badges.join(', ') : '—'}
          </p>
        </>
      )}
    </div>
  )
}
