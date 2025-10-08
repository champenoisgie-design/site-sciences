'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/account', label: 'Ma progression' },
  { href: '/account/badges', label: 'Mes badges' },
  { href: '/account/password', label: 'Changer le mot de passe' },
]

export default function AccountTabs() {
  const pathname = usePathname() || '/account'
  return (
    <nav className="mb-6 flex gap-4 border-b">
      {tabs.map((t) => {
        const active =
          t.href === '/account'
            ? pathname === '/account'
            : pathname.startsWith(t.href)
        return (
          <Link
            key={t.href}
            href={t.href}
            className={
              'px-4 py-2 -mb-px border-b-2 transition-colors ' +
              (active
                ? 'border-black dark:border-white font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200')
            }
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
