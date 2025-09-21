"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeSwitchInline from "@/components/ThemeSwitchInline";
import ModeLearningSwitcher from "@/components/ModeLearningSwitcher";

const navRight = [
  { href: "/", label: "Accueil" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d=>setUser(d.user)).catch(()=>{});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method:"POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Titre */}
        <div className="min-w-0">
          <Link href="/" className="font-semibold">Site Sciences</Link>
        </div>

        {/* Centre : Thème + Mode d'apprentissage (une seule fois) */}
        <div className="flex items-center gap-3">
          <ThemeSwitchInline />
          <ModeLearningSwitcher />
        </div>

        {/* Droite : Nav + Compte */}
        <ul className="flex items-center gap-2">
          {navRight.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded px-3 py-1 text-sm transition ${
                    active
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          {!user ? (
            <>
              <li>
                <Link href="/login" className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link href="/login" className="rounded px-3 py-1 text-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  Créer un compte
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/account" className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  Mon compte
                </Link>
              </li>
              <li>
                <button onClick={logout} className="rounded px-3 py-1 text-sm border hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  Déconnexion
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
