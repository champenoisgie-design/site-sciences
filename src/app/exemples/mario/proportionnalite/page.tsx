"use client";
import React, { useState } from "react";
import Link from "next/link";

type Props = {};
const PAGE_TITLE = "Proportionnalité (Mario) — Exemple guidé (mario)";
const steps: string[] = [
  "Étape 1 · 3 champignons pour 1 joueur. Pour 4 joueurs ? (12)",
  "Étape 2 · Compléter le tableau (1→3, 2→6, 5→15…).",
  "Étape 3 · Identifier le coefficient multiplicateur.",
  "Étape 4 · Correction instantanée + rappel.",
];

export default function GuidedExample({}: Props) {
  const [i, setI] = useState(0);
  const isLast = i === steps.length - 1;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{PAGE_TITLE}</h1>
        <Link href="../.." className="text-sm underline underline-offset-4">
          Revenir au thème
        </Link>
      </div>
      <p className="text-muted-foreground">
        Compléter un tableau de proportionnalité avec un coefficient multiplicateur.
      </p>

      <div className="rounded-2xl border p-5 bg-white space-y-4">
        <div className="text-xs text-muted-foreground">Étape {i + 1} / {steps.length}</div>
        <div className="rounded-xl border bg-emerald-50/70 p-4 text-sm">
          {steps[i]}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
          >
            ← Précédent
          </button>
          {!isLast ? (
            <button
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}
            >
              Continuer →
            </button>
          ) : (
            <div className="flex gap-2">
              <Link href="/panier" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Choisir ce thème
              </Link>
              <Link href="/preview/accueil" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
                Essayer une autre démo
              </Link>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Vous pouvez changer de thème à tout moment depuis votre compte.
        <Link href="/parents" className="ml-1 underline underline-offset-4">En savoir plus pour les parents</Link>.
      </p>
    </main>
  );
}
