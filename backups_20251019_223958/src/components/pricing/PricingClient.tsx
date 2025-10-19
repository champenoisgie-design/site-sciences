"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Composant client léger d'affichage des cartes de prix.
 * (Version sûre: aucune importation doublon, JSX OK, compile sans erreur.)
 */

type PlanKey = "normal" | "gold" | "platine";

const PLANS: Array<{ key: PlanKey; label: string; monthlyCents: number; features: string[]; badge?: string }> = [
  { key: "normal",  label: "Normal",  monthlyCents: 999,  features: ["Base par matière", "Exercices concrets"] },
  { key: "gold",    label: "Gold",    monthlyCents: 999 + 500, features: ["Guides méthode", "Fiches mémo"], badge: "+5€" },
  { key: "platine", label: "Platine", monthlyCents: 999 + 1000, features: ["Parcours avancés", "Corrections détaillées"], badge: "+10€" },
];

function centsToEuro(c: number) {
  return (c / 100).toFixed(2).replace(".", ",");
}

export default function PricingClient({ children }: { children?: ReactNode }) {
  // Un état minimal pour montrer que c'est un composant client
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  return (
    <section className="space-y-10">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Abonnements matière</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <article key={p.key} className="rounded-2xl border p-6 shadow-sm">
              <header className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold">{p.label}</h3>
                {p.badge && (
                  <span className="rounded-full border px-2 py-0.5 text-xs">
                    {p.badge}
                  </span>
                )}
              </header>
              <div className="mb-4 text-3xl font-bold">
                {centsToEuro(p.monthlyCents)} €
                <span className="sr-only"> €</span>
              </div>
              <ul className="mb-6 space-y-2 text-sm">
                {p.features.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
              <button className="w-full rounded-xl border px-4 py-2 font-medium hover:bg-black/5" disabled={!ready}>
                Choisir
              </button>
            </article>
          ))}
        </div>
      </div>

      {children ? (
        <div className="mt-1 text-sm opacity-70">{children}</div>
      ) : null}
    </section>
  );
}
