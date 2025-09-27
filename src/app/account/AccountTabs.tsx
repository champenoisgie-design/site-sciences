'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/account',          label: 'Ma progression' },
  { href: '/account/badges',   label: 'Mes badges' },
  { href: '/account/password', label: 'Changer le mot de passe' },
];

export default function AccountTabs() {
  const pathname = usePathname() || '';
  return (
    <nav className="border-b bg-white/70 backdrop-blur">
      <div className="px-6">
        <ul className="flex gap-2">
          {TABS.map((t) => {
            const isActive =
              pathname === t.href ||
              (t.href !== '/account' && pathname.startsWith(t.href));
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={[
                    'inline-block px-4 py-2 rounded-t-xl',
                    isActive
                      ? 'bg-white border-x border-t -mb-px font-medium'
                      : 'text-zinc-600 hover:text-zinc-900',
                  ].join(' ')}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
