'use client'

import { useState } from 'react'

type Props = {
  label: string
  value: string
  onChange: (val: string) => void
  required?: boolean
  name?: string
}

export default function PasswordInput({
  label,
  value,
  onChange,
  required,
  name,
}: Props) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={show ? 'text' : 'password'}
          className="w-full border rounded p-2 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  )
}
