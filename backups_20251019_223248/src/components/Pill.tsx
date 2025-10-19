'use client'

type Props = {
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
  title?: string
}
export default function Pill({ selected, onClick, children, title }: Props) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-full text-sm border transition',
        selected
          ? 'bg-black text-white border-black'
          : 'bg-white text-black border-gray-300 hover:bg-gray-50',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
