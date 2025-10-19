"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Mini-bandeau marketing.
 * - Texte demandé (avec 4 matières + modes).
 * - Disparaît si "abonnement" détecté en local (demo) OU query ?sub=1
 *   -> Pour la prod, on branchera sur ton endpoint /api/subscriptions/check.
 */
export default function MiniBanner() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("sub") === "1") setHidden(true);
    if (localStorage.getItem("hasSub") === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 rounded-xl border bg-emerald-600 text-white">
          <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm md:text-base">
              <strong>Dès 9,99 € / mois</strong>. <span className="opacity-90">Maths, Physique, Chimie, SVT.</span>
              {" "}Modes <span className="opacity-90">TDAH, DYS, TSA, HPI</span> activables à la carte.
            </p>
            <div className="flex items-center gap-2">
              <Link href="/tarifs" className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-white/90">
                Voir les formules
              </Link>
              <Link href="/tarifs" className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-medium hover:bg-white/10">
                Choisir ta matière
              </Link>
            </div>
          </div>
        </div>
        {/* Bouton démo pour "masquer si abonné" (preview only) */}
        <div className="mt-1 text-right">
          <button
            onClick={() => { localStorage.setItem("hasSub","1"); location.reload(); }}
            className="text-xs opacity-60 hover:opacity-100 underline"
          >
            (Masquer comme si abonné)
          </button>
        </div>
      </div>
    </div>
  );
}
