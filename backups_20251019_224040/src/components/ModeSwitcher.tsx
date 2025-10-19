'use client'

const MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'tdah', label: 'TDAH' },
  { value: 'dys', label: 'DYS' },
  { value: 'tsa', label: 'TSA' },
  { value: 'hpi', label: 'HPI' },
]

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[2]) : null
}

export default function ModeSwitcher() {
  const initial = (getCookie('learningMode') as string) || 'normal'

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    if (value === 'normal') {
      document.cookie = `learningMode=normal;path=/;max-age=${60 * 60 * 24 * 365}`
      window.dispatchEvent(
        new CustomEvent('learning-mode:changed', { detail: value }),
      )
      return
    }
    window.location.href = `/tarifs/mode-d-apprentissage/${value}`
  }

  return (
    <select
      className="pill-select"
      defaultValue={initial}
      onChange={onChange}
      aria-label="Mode d’apprentissage"
    >
      {MODES.map((m) => (
        <option key={m.value} value={m.value}>
          {m.label}
        </option>
      ))}
    </select>
  )
}
