"use client";
import Link from "next/link";
import VisualThemeSelector from "@/components/theme/VisualThemeSelector";
import LearningModeLite from "@/components/header/LearningModeLite";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">Site Sciences</Link>
          <div className="hidden sm:flex items-center gap-3">
            <VisualThemeSelector />
            <LearningModeLite />
          </div>
        </div>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/">Accueil</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/compte">Mon compte</Link>
          <Link href="/logout" className="opacity-70">Déconnexion</Link>
        </nav>
      </div>
    </header>
  );
}
