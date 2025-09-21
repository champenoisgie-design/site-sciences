"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeSwitcher from "@/components/ModeSwitcher";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/tutoriels", label: "Tutoriels" },
  { href: "/solo", label: "Solo" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">Site Sciences</Link>
        <ul className="flex items-center gap-2">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded px-3 py-1 text-sm transition 
                    ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="pl-2 ml-2 border-l">
            <ModeSwitcher />
          </li>
        </ul>
      </nav>
    </header>
  );
}
