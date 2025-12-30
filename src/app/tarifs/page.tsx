"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Billing = "monthly" | "annual";
type PlanKey = "normal" | "gold" | "platine";

type Plan = {
  key: PlanKey;
  title: string;
  badge?: { label: string; tone: "blue" | "green" };
  priceMonthly: number; // mensuel sans engagement
  priceAnnual: number;  // prix mensuel après remise annuelle (-20%), engagement 12 mois
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
        priceMonthly: 12.49,
        priceAnnual: 9.99,
        badge: { label: "-20% annuel", tone: "blue" },
        bullets: [
          "Essentiel pour démarrer",
          "Mode Focus + exercices illimités",
          "Badges & progression (basique)",
        ],
        cta: "Choisir Normal",
        ctaTone: "dark",
      },
      {
        key: "gold",
        title: "Gold",
        priceMonthly: 19.99,
        priceAnnual: 15.99,
        badge: { label: "Meilleur choix", tone: "blue" },
        bullets: [
          "Parents inclus (tableau + suivi)",
          "Révision intelligente + stats & corrections expliquées",
          "Indices guidés + objectifs avancés + sauvegarde session",
        ],
        cta: "Choisir Gold",
        ctaTone: "blue",
      },
      {
        key: "platine",
        title: "Platine",
        priceMonthly: 24.99,
        priceAnnual: 19.99,
        badge: { label: "Premium", tone: "green" },
        bullets: [
          "Tout Gold + priorité",
          "Co-Pilot & Mentor",
          "Services avancés + support prioritaire",
        ],
        cta: "Choisir Platine",
        ctaTone: "green",
      },
    ],
    []
  );

  const goPanier = (plan: PlanKey) => {
    router.push(`/panier?plan=${encodeURIComponent(plan)}`);
  };

  const featureRows: Array<{
    label: string;
    normal: boolean | "—";
    gold: boolean | "—";
    platine: boolean | "—";
  }> = [
    { label: "Accès complet aux leçons & exercices", normal: true, gold: true, platine: true },
    { label: "Mode Focus (timers, pas-à-pas, UI anti-distraction)", normal: true, gold: true, platine: true },
    { label: "Tests de départ & révision intelligente (basique)", normal: true, gold: true, platine: true },
    { label: "Fiches mémo prêtes (PDF avec filigrane)", normal: true, gold: true, platine: true },

    // Différenciation Gold
    { label: "Tableau Parents + e-mails de suivi", normal: "—", gold: true, platine: true },
    { label: "Parcours de révision intelligent (suggestions)", normal: "—", gold: true, platine: true },
    { label: "Stats détaillées (par matière / 7-30 jours)", normal: "—", gold: true, platine: true },
    { label: "Indices intelligents progressifs", normal: "—", gold: true, platine: true },
    { label: "Corrections expliquées étape par étape", normal: "—", gold: true, platine: true },
    { label: "Objectifs hebdo + badges avancés", normal: "—", gold: true, platine: true },
    { label: "Sauvegarde session (reprendre où on s’est arrêté)", normal: "—", gold: true, platine: true },

    // Premium Platine
    { label: "Support prioritaire", normal: "—", gold: "—", platine: true },
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

          <div className="mt-3 text-xs text-slate-500">
            {billing === "annual" ? "Prix mensuel après remise annuelle (engagement 12 mois)." : "Prix mensuel sans engagement."}
          </div>

          {/* Promo matières */}
          <div className="mt-5 inline-flex max-w-2xl items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
            <div className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">%</div>
            <div>
              <div className="text-sm font-semibold">Promo matières (même niveau)</div>
              <div className="text-sm text-slate-600">
                Dès <span className="font-semibold">3 matières</span> prises dans le <span className="font-semibold">même niveau</span>,
                une réduction s’applique sur le total du panier (hors achats uniques).
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((p) => {
            const display = billing === "annual" ? p.priceAnnual : p.priceMonthly;
            return (
              <div
                key={p.key}
                className={cn(
                  "rounded-2xl border bg-white p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] flex flex-col h-full",
                  p.key === "gold" ? "border-indigo-200" : "border-slate-200"
                )}
              >
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
                  <div className="text-3xl font-semibold">{money(display)}</div>
                  <div className="text-sm text-slate-500">/ mois ({billing === "annual" ? "engagement 12 mois" : "sans engagement"})</div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-700 min-h-[96px]">
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
                    "mt-auto w-full rounded-xl px-4 py-3 text-sm font-semibold",
                    p.ctaTone === "dark" && "bg-slate-900 text-white hover:bg-slate-800",
                    p.ctaTone === "blue" && "bg-indigo-600 text-white hover:bg-indigo-500",
                    p.ctaTone === "green" && "bg-emerald-600 text-white hover:bg-emerald-500"
                  )}
                >
                  {p.cta}
                </button>

                <div className="mt-3 text-xs text-slate-500">Changement de mode à tout moment. Paiement sécurisé.</div>
              </div>
            );
          })}
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
            <div key={r.label} className="grid grid-cols-[1.4fr_.6fr_.6fr_.6fr] items-center border-b border-slate-100 px-4 py-3 text-sm">
              <div className="text-slate-800">{r.label}</div>
              <div className="flex justify-center"><Cell v={r.normal} /></div>
              <div className="flex justify-center"><Cell v={r.gold} /></div>
              <div className="flex justify-center"><Cell v={r.platine} /></div>
            </div>
          ))}

          <div className="px-4 py-4 text-xs text-slate-500">
            * Gold = progression guidée + Parents inclus. Platine = tout débloqué + services avancés & prioritaire.
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold">Tu hésites ?</div>
          <div className="mt-1 text-sm text-slate-600">
            <span className="font-semibold">Gold</span> = meilleur rapport pour une progression régulière (guidage + stats + Parents inclus).
            <span className="ml-2"><span className="font-semibold">Platine</span> = premium (Co-Pilot + Mentor + prioritaire).</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => goPanier("gold")} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Choisir Gold
            </button>
            <button onClick={() => goPanier("platine")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              Passer en Platine
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
