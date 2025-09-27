"use client"
import * as React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string }

export default function PasswordInput({ label, ...props }: Props) {
  const ref = React.useRef<HTMLInputElement>(null)
  const [visible, setVisible] = React.useState(false)
  return (
    <div>
      {label && <label className="text-sm">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className="mt-1 w-full rounded border bg-transparent px-3 py-2 pr-16"
          {...props}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs underline"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'masquer' : 'afficher'}
        </button>
      </div>
    </div>
  )
}
