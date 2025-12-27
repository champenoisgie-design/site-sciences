"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Billing = "monthly" | "annual";

type PlanKey = "normal" | "gold" | "platine";

type Plan = {
  key: PlanKey;
  title: string;
  badge?: { label: string; tone: "blue" | "green" };
  priceMonthly: number; // prix affiché en mensuel (ou mensuel "après annual" comme sur la capture)
  bullets: string[];
  cta: string;
  ctaTone: "dark" | "blue" | "green";
};

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}
function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

export default function TarifsPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>("annual");

  const plans: Plan[] = useMemo(
    () => [
      {
        key: "normal",
        title: "Normal",
        priceMonthly: 7.99,
        badge: { label: "-20% annuel", tone: "blue" },
        bullets: ["Essentiel pour démarrer", "Focus & révision intelligente"],
        cta: "Choisir Normal",
        ctaTone: "dark",
      },
      {
        key: "gold",
        title: "Gold",
        priceMonthly: 11.99,
        badge: { label: "Meilleur choix", tone: "blue" },
        bullets: ["Fiches perso & Parents", "Idéal pour progresser régulièrement"],
        cta: "Choisir Gold",
        ctaTone: "blue",
      },
      {
        key: "platine",
        title: "Platine",
        priceMonthly: 19.99,
        badge: { label: "Premium", tone: "green" },
        bullets: ["Co-Pilot & Mentor", "Tout débloqué + prioritaire"],
        cta: "Choisir Platine",
        ctaTone: "green",
      },
    ],
    []
  );

  const goPanier = (plan: PlanKey) => {
    // On passe le plan tel quel : /panier?plan=normal|gold|platine
    router.push(`/panier?plan=${encodeURIComponent(plan)}`);
  };

  const featureRows: Array<{ label: string; normal: boolean | "—" ; gold: boolean | "—"; platine: boolean | "—" }> = [
    { label: "Accès complet aux leçons & exercices", normal: true, gold: true, platine: true },
    { label: "Mode Focus (timers, pas-à-pas, UI anti-distraction)", normal: true, gold: true, platine: true },
    { label: "Tests de départ & révision intelligente", normal: true, gold: true, platine: true },
    { label: "Fiches mémo prêtes (PDF avec filigrane)", normal: true, gold: true, platine: true },
    { label: "Fiches mémo personnalisées", normal: "—", gold: true, platine: true },
    { label: "Skins & badges de progression", normal: true, gold: true, platine: true },
    { label: "Tableau Parents + e-mails de suivi", normal: "—", gold: true, platine: true },
    { label: "Support prioritaire", normal: "—", gold: "—", platine: true },
    { label: "Mode sélectionné valable pour toutes matières et tous niveaux", normal: true, gold: true, platine: true },

    { label: "Modes complémentaires (TDAH, DYS, TSA, HPI) — add-ons", normal: "—", gold: "—", platine: "—" },

    { label: "Co-Pilot Sciences (coaching IA pas-à-pas)", normal: "—", gold: "—", platine: true },
    { label: "Rapport hebdomadaire de progression (PDF)", normal: "—", gold: "—", platine: true },
    { label: "Mode Mentor (assistant éducatif prioritaire)", normal: "—", gold: "—", platine: true },
    { label: "Missions & défis avancés (science appliquée)", normal: "—", gold: "—", platine: true },
    { label: "Simulation 3D (physique/chimie) interactives", normal: "—", gold: "—", platine: true },
    { label: "Badges Prestige & certificats imprimables", normal: "—", gold: "—", platine: true },
    { label: "Fiches HD sans watermark (illimité)", normal: "—", gold: "—", platine: true },
    { label: "Multi-profil Famille (parents + 2 enfants)", normal: "—", gold: "—", platine: true },
    { label: "Avantage fidélité (renouvellement annuel -10%)", normal: "—", gold: "—", platine: true },
  ];

  const Check = ({ on }: { on: boolean }) => (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-sm text-xs font-bold",
        on ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
      )}
      aria-label={on ? "Inclus" : "Non inclus"}
    >
      {on ? "✓" : "—"}
    </span>
  );

  const Cell = ({ v }: { v: boolean | "—" }) => {
    if (v === "—") return <span className="text-slate-400">—</span>;
    return <Check on={v} />;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Tarifs simples, résultats concrets</h1>
          <p className="mt-2 text-slate-600">
            Compare les modes et choisis le meilleur pour ta progression.
            <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              -20% en annuel • Pack Famille -20% (≥ 2 niveaux)
            </span>
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold",
                billing === "monthly" ? "bg-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold",
                billing === "annual" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Annuel
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-500">Prix mensuel après remise annuelle (engagement 12 mois).</div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-semibold">{p.title}</div>
                {p.badge ? (
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      p.badge.tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {p.badge.label}
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-3xl font-semibold">{money(p.priceMonthly)}</div>
                <div className="text-sm text-slate-500">/ mois ({billing === "annual" ? "engagement 12 mois" : "sans engagement"})</div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-sm bg-emerald-600 text-xs font-bold text-white">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => goPanier(p.key)}
                className={cn(
                  "mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold",
                  p.ctaTone === "dark" && "bg-slate-900 text-white hover:bg-slate-800",
                  p.ctaTone === "blue" && "bg-indigo-600 text-white hover:bg-indigo-500",
                  p.ctaTone === "green" && "bg-emerald-600 text-white hover:bg-emerald-500"
                )}
              >
                {p.cta}
              </button>

              <div className="mt-3 text-xs text-slate-500">Changement de mode à tout moment. Paiement sécurisé.</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <h2 className="mt-12 text-xl font-semibold">Comparatif des fonctionnalités</h2>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1.4fr_.6fr_.6fr_.6fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <div>Fonctionnalité</div>
            <div className="text-center">Normal</div>
            <div className="text-center">Gold</div>
            <div className="text-center">Platine</div>
          </div>

          {featureRows.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[1.4fr_.6fr_.6fr_.6fr] items-center border-b border-slate-100 px-4 py-3 text-sm"
            >
              <div className="text-slate-700">{r.label}</div>
              <div className="text-center"><Cell v={r.normal} /></div>
              <div className="text-center"><Cell v={r.gold} /></div>
              <div className="text-center"><Cell v={r.platine} /></div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-slate-500">
          * Offre Platine inclut l’ensemble des fonctionnalités Gold + Normal, avec des services avancés et priorité support.
        </div>

        {/* Banner */}
        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Tu hésites entre Gold et Platine ?</div>
              <div className="mt-1 text-sm text-slate-700">
                Gold = meilleur rapport / progression régulière. Platine = tout débloqué + Co-Pilot + Mentor + prioritaire.
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Prix affiché mensuel. En annuel (-20%), engagement 12 mois. Pack Famille -20% si au moins 2 niveaux.
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goPanier("gold")}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Choisir Gold
              </button>
              <button
                onClick={() => goPanier("platine")}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Passer en Platine
              </button>
            </div>
          </div>
        </div>

        {/* FAQ (3 cards) */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="font-semibold">Puis-je changer de plan plus tard ?</div>
            <div className="mt-2 text-sm text-slate-600">
              Oui, à tout moment. Le passage à Gold/Platine débloque immédiatement les fonctionnalités associées.
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="font-semibold">Comment fonctionne l’annuel (-20%) ?</div>
            <div className="mt-2 text-sm text-slate-600">
              Le prix est lissé au mois pour l’affichage, mais l’abonnement est avec un engagement de 12 mois.
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="font-semibold">Pack Famille ?</div>
            <div className="mt-2 text-sm text-slate-600">
              Ajoute au moins un autre niveau (ex: 4e + 2nde) pour activer -20% supplémentaires. Cumulable avec l’annuel.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
