// src/app/(preview)/preview/accueil/PreviewHeader.tsx
"use client";

import Link from "next/link";
import AuthNav from "@/components/nav/AuthNav";

export type PreviewMode = "visitor" | "student";

export default function PreviewHeader({ mode }: { mode: PreviewMode }) {
  const isStudent = mode === "student";

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo + nom du site */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/40">
            <span className="text-xs font-bold text-emerald-300">SS</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-50">
              Site Sciences
            </div>
            <div className="text-xs text-slate-400">
              Barre de navigation (prévisualisation)
            </div>
          </div>
        </div>

        {/* Liens principaux */}
        <nav className="hidden items-center gap-4 text-sm text-slate-200 md:flex">
          <Link href="/" className="hover:text-emerald-300 transition">
            Accueil
          </Link>
          <Link href="/tarifs" className="hover:text-emerald-300 transition">
            Tarifs
          </Link>
          <Link href="/contact" className="hover:text-emerald-300 transition">
            Contact
          </Link>
        </nav>

        {/* Zone droite : état de connexion simulé */}
        <div className="flex items-center gap-2">
          {isStudent ? (
            <>
              <Link
                href="/compte"
                className="hidden text-sm text-slate-200 hover:text-emerald-300 md:inline"
              >
                Mon compte
              </Link>
              <Link
                href="/logout"
                className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-900"
              >
                Déconnexion
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
