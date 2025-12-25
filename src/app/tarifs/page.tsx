"use client";

import { useState } from "react";
// Adapte cet import selon comment tu as défini ton header
import PreviewHeader from "../accueil/PreviewHeader";
// ou, si c'est un export nommé :
// import { PreviewHeader } from "../accueil/PreviewHeader";

type AudienceMode = "visitor" | "already-subscribed";

type PlanId = "gold" | "platine" | "family";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  badge?: string;
  bestFor: string;
};

const PLANS: Plan[] = [
  {
    id: "gold",
    name: "Gold",
    price: "9,99 € / mois",
    tagline: "Tout le programme + suivi intelligent",
    badge: "Le plus populaire",
    bestFor: "Collège & Lycée",
  },
  {
    id: "platine",
    name: "Platine",
    price: "14,99 € / mois",
    tagline: "Coaching avancé + multi-joueur",
    badge: "Perf max",
    bestFor: "Préparation examens / brevet / bac",
  },
  {
    id: "family",
    name: "Famille",
    price: "19,99 € / mois",
    tagline: "Jusqu’à 4 profils enfants",
    badge: "Familles",
    bestFor: "Fratries / parents impliqués",
  },
];

const FEATURES = [
  {
    label: "Programme officiel couvert",
    gold: true,
    platine: true,
    family: true,
  },
  {
    label: "Exercices gamifiés illimités",
    gold: true,
    platine: true,
    family: true,
  },
  {
    label: "Multi-joueur / duels entre amis",
    gold: false,
    platine: true,
    family: true,
  },
  {
    label: "Suivi parent détaillé",
    gold: true,
    platine: true,
    family: true,
  },
  {
    label: "Coaching & plans de révision",
    gold: false,
    platine: true,
    family: true,
  },
  {
    label: "Jusqu’à 4 profils enfants",
    gold: false,
    platine: false,
    family: true,
  },
];

const CURRENT_PLAN_FOR_PREVIEW: PlanId = "gold"; // mock : l'élève est déjà Gold

export default function PreviewTarifsPage() {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("visitor");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("gold");

  const selectedPlanObject = PLANS.find((p) => p.id === selectedPlan)!;

  const isDowngrade =
    audienceMode === "already-subscribed" &&
    selectedPlan === "gold" &&
    CURRENT_PLAN_FOR_PREVIEW !== "gold";

  const isSamePlan =
    audienceMode === "already-subscribed" &&
    selectedPlan === CURRENT_PLAN_FOR_PREVIEW;

  const isUpgrade =
    audienceMode === "already-subscribed" &&
    selectedPlan !== CURRENT_PLAN_FOR_PREVIEW;

  const ctaLabel = (() => {
    if (audienceMode === "visitor") {
      return `Commencer avec l’offre ${selectedPlanObject.name}`;
    }
    if (isSamePlan) {
      return "Gérer mon abonnement";
    }
    if (isUpgrade) {
      return `Passer à l’offre ${selectedPlanObject.name}`;
    }
    if (isDowngrade) {
      return `Adapter mon abonnement`;
    }
    return "Gérer mon abonnement";
  })();

  const ctaSubLabel =
    audienceMode === "visitor"
      ? "Sans engagement, annulation en 2 clics."
      : isUpgrade
      ? "Conservez votre progression, on s’occupe du reste."
      : "Retrouvez factures, renouvellement et options dans votre espace.";

  const audienceBadge =
    audienceMode === "visitor"
      ? "Version VISITEUR (non connecté)"
      : "Version DÉJÀ ABONNÉ (mock)";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PreviewHeader
        // Adapte ces props à ce que tu utilises déjà
        currentRoute="tarifs"
        isAuthenticated={audienceMode === "already-subscribed"}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-8">
        {/* Bandeau contexte preview */}
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-full bg-white px-3 text-xs font-medium text-slate-900">
                Preview Tarifs
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-9000">
                {audienceBadge}
              </span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-700">
                Live
              </span>
              <span>Exemple visuel avant les vraies pages</span>
            </div>
          </div>
        </div>

        {/* Hero + switch Visiteur / Déjà abonné */}
        <section className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-sky-50 via-slate-50 to-violet-50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Choisis l’offre qui colle à{" "}
              <span className="underline decoration-sky-400 decoration-2">
                ton niveau
              </span>{" "}
              et à ta famille.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">
              Tous les plans débloquent la progression gamifiée en sciences. Les
              offres Platine et Famille ajoutent le coaching, le multi-joueur et
              un vrai espace parents.
            </p>
            <ul className="flex flex-wrap gap-2 text-xs text-slate-600">
              <li className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1">
                <span>✅</span> Sans engagement
              </li>
              <li className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1">
                <span>🔒</span> Paiement sécurisé
              </li>
              <li className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1">
                <span>👨‍👩‍👧‍👦</span> Pensé pour les familles
              </li>
            </ul>
          </div>

          {/* Switch audience */}
          <div className="shrink-0 rounded-xl bg-white/80 p-3 text-xs text-slate-600 shadow-sm">
            <p className="mb-2 font-medium text-slate-700">
              Vue de la page :
            </p>
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setAudienceMode("visitor")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  audienceMode === "visitor"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-9000"
                }`}
              >
                Visiteur
              </button>
              <button
                type="button"
                onClick={() => setAudienceMode("already-subscribed")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  audienceMode === "already-subscribed"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-9000"
                }`}
              >
                Déjà abonné
              </button>
            </div>

            {audienceMode === "already-subscribed" && (
              <p className="mt-2 text-[11px] leading-snug text-slate-9000">
                Mock : l’élève a déjà un abonnement{" "}
                <span className="font-semibold text-slate-700">
                  {PLANS.find((p) => p.id === CURRENT_PLAN_FOR_PREVIEW)?.name}
                </span>
                . Les CTA s’adaptent si on clique sur une autre offre.
              </p>
            )}
          </div>
        </section>

        {/* Cartes d'offres */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-9000">
              Offres disponibles
            </h2>
            <p className="text-xs text-slate-9000">
              Clique sur une offre pour voir le CTA et le panier associés.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlan;
              const isCurrent =
                audienceMode === "already-subscribed" &&
                plan.id === CURRENT_PLAN_FOR_PREVIEW;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`flex flex-col rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md md:p-5 ${
                    isSelected
                      ? "border-sky-400 shadow-md"
                      : "border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-semibold text-slate-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-9000">{plan.bestFor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {plan.price}
                      </p>
                      <p className="text-[11px] text-slate-9000">
                        Sans engagement
                      </p>
                    </div>
                  </div>

                  <p className="mb-3 text-xs text-slate-600">
                    {plan.tagline}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    {plan.badge && (
                      <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                        ⭐ {plan.badge}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        ✅ Offre actuelle
                      </span>
                    )}
                    {isSelected && !isCurrent && (
                      <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-900">
                        Sélectionnée
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Comparateur */}
        <section className="space-y-4 rounded-2xl ui-card/80 p-4 md:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-9000">
              Comparateur d’offres
            </h2>
            <p className="text-xs text-slate-9000">
              Vue tableau pour la page desktop & l’espace parents.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1 text-xs">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-9000">
                  <th className="w-1/2 pb-2 pr-4">Fonctionnalités</th>
                  <th className="w-1/6 pb-2 text-center">Gold</th>
                  <th className="w-1/6 pb-2 text-center">Platine</th>
                  <th className="w-1/6 pb-2 text-center">Famille</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature) => (
                  <tr key={feature.label} className="align-middle">
                    <td className="rounded-l-xl bg-slate-50 px-3 py-2 text-slate-700">
                      {feature.label}
                    </td>
                    <td className="bg-slate-50 text-center">
                      {feature.gold ? "✅" : "—"}
                    </td>
                    <td className="bg-slate-50 text-center">
                      {feature.platine ? "✅" : "—"}
                    </td>
                    <td className="rounded-r-xl bg-slate-50 text-center">
                      {feature.family ? "✅" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Zone CTA dynamique (qui préfigure le futur panier) */}
        <section className="space-y-4 rounded-2xl bg-white px-4 py-5 text-slate-900 md:px-6 md:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Étape suivante
              </p>
              <h2 className="text-lg font-semibold">
                {audienceMode === "visitor"
                  ? "On prépare le panier avec ton offre."
                  : "On prépare la modification de ton abonnement."}
              </h2>
              <p className="text-xs text-slate-600">{ctaSubLabel}</p>
            </div>

            <div className="text-right text-sm">
              <p className="font-semibold">
                {selectedPlanObject.name} – {selectedPlanObject.price}
              </p>
              {audienceMode === "already-subscribed" && isSamePlan && (
                <p className="text-[11px] text-emerald-300">
                  Aucun changement de prix, juste la gestion de l’abonnement.
                </p>
              )}
              {audienceMode === "already-subscribed" && isUpgrade && (
                <p className="text-[11px] text-amber-200">
                  Simuler un écran “confirmer le changement d’offre”.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-sky-300"
            >
              {ctaLabel}
            </button>

            <div className="space-y-1 text-[11px] text-slate-600">
              <p>
                👉 Dans les vraies pages, ce bouton amènera sur le{" "}
                <span className="font-medium">Panier / Checkout preview</span>{" "}
                avec récap de l’offre, options et paiement.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
