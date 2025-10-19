"use client";

import React from "react";
import Link from "next/link";

/** Garde ces imports si tes composants existent déjà dans ton projet */
import ModeSwitcher from "@/components/ModeSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

/** Sélecteur de thème visuel (OnePiece1, Basique, etc.) */
import VisualThemeSelector from "@/components/theme/VisualThemeSelector";

/** Import dynamique du sélecteur de modes complémentaires (TDAH, DYS, TSA, HPI) */
import dynamic from "next/dynamic";
const LearningModeLite = dynamic(
  () => import("@/components/header/LearningModeLite"),
  { ssr: false }
);

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 gap-3">
        {/* Gauche : logo / nom du site */}
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">
            Site Sciences
          {/* Sélecteur de thème visuel */}
          <div className="hidden sm:block ml-4"><VisualThemeSelector compact /></div>
          </Link>
        </div>

        {/* Centre : sélecteurs */}
        <div className="flex items-center gap-4">
          {/* Thème visuel (nouveau menu) */}
          <VisualThemeSelector compact />
          {/* Modes complémentaires (TDAH, DYS, TSA, HPI) */}
          <LearningModeLite />
        </div>

        {/* Droite : nav & switches existants */}
        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm">Accueil</Link>
          <Link href="/tarifs" className="text-sm">Tarifs</Link>
          <Link href="/contact" className="text-sm">Contact</Link>
          <Link href="/compte" className="text-sm">Mon compte</Link>
          <Link href="/logout" className="text-sm">Déconnexion</Link>

          {/* Conserve tes boutons existants si utilisés */}
          {typeof ModeSwitcher !== "undefined" && <ModeSwitcher />}
          {typeof ThemeToggle !== "undefined" && <ThemeToggle />}
        </nav>
      </div>
    </header>
  );
}
