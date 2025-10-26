"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// chargés côté client uniquement
const VisualThemeSelector = dynamic(
  () => import("@/components/theme/VisualThemeSelector"),
  { ssr: false }
);
const LearningModeLite = dynamic(
  () => import("@/components/header/LearningModeLite"),
  { ssr: false }
);

export default function PreviewHeader() {
  return (
    <header
      data-role="preview-header"
      className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        {/* Gauche : logo + sélecteurs */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">Site Sciences</Link>
          <div className="h-5 w-px bg-black/10" />
          <VisualThemeSelector compact />
          <div className="h-5 w-px bg-black/10" />
          <LearningModeLite />
        </div>

        {/* Droite : nav simple */}
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Accueil</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/compte">Mon compte</Link>
          <Link href="/logout">Déconnexion</Link>
        </nav>
      </div>
    </header>
  );
}
