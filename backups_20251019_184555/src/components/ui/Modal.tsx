'use client'
import { useEffect } from 'react'

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Aperçu'}
    >
      <div className="modal-panel">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
      <button
        className="modal-scrim"
        onClick={onClose}
        aria-label="Fermer"
      ></button>
    </div>
  )
}
