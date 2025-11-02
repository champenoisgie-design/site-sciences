"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

type PlanKey = "Normal" | "Gold" | "Platine";
type Period = "Mensuel" | "Annuel";

type Feature = {
  label: string;
  details?: string;
  availability: Record<PlanKey, "included" | "partial" | "no">;
};

const BASE_PRICES = {
  Mensuel: { Normal: 9.99, Gold: 14.99, Platine: 24.99 },
  Annuel:  { Normal: 9.99, Gold: 14.99, Platine: 24.99 }, // affichage base avant remise
} as const;

const ANNUAL_DISCOUNT = 0.20; // -20%

const features: Feature[] = [
  { label: "Accès complet aux leçons & exercices", availability: { Normal: "included", Gold: "included", Platine: "included" } },
  { label: "Mode Focus (timers, pas-à-pas, UI anti-distraction)", availability: { Normal: "included", Gold: "included", Platine: "included" } },
  { label: "Tests de départ & révision intelligente", availability: { Normal: "included", Gold: "included", Platine: "included" } },
  { label: "Fiches mémo prêtes (PDF avec filigrane)", availability: { Normal: "included", Gold: "included", Platine: "included" } },
  { label: "Fiches mémo personnalisées", availability: { Normal: "no", Gold: "included", Platine: "included" } },
  { label: "Skins & badges de progression", availability: { Normal: "included", Gold: "included", Platine: "included" } },
  { label: "Tableau Parents + e-mails de suivi", availability: { Normal: "no", Gold: "included", Platine: "included" } },
  { label: "Support prioritaire", availability: { Normal: "no", Gold: "no", Platine: "included" } },
  { label: "Mode sélectionné valable pour toutes matières et tous niveaux", availability: { Normal: "included", Gold: "included", Platine: "included" } },
  { label: "Modes complémentaires (TDAH, DYS, TSA, HPI) — add-ons", details: "Valables pour toutes matières et tous niveaux (en sus)", availability: { Normal: "no", Gold: "no", Platine: "no" } },

  // 🔥 Nouvelles fonctionnalités Platine
  { label: "Co-Pilot Sciences (coaching IA pas-à-pas)", availability: { Normal: "no", Gold: "partial", Platine: "included" } },
  { label: "Rapport hebdomadaire de progression (PDF)", availability: { Normal: "no", Gold: "partial", Platine: "included" } },
  { label: "Mode Mentor (assistant éducatif prioritaire)", availability: { Normal: "no", Gold: "no", Platine: "included" } },
  { label: "Missions & défis avancés (science appliquée)", availability: { Normal: "no", Gold: "partial", Platine: "included" } },
  { label: "Simulations 3D (physique/chimie) interactives", availability: { Normal: "no", Gold: "no", Platine: "included" } },
  { label: "Badges Prestige & certificats imprimables", availability: { Normal: "no", Gold: "partial", Platine: "included" } },
  { label: "Fiches HD sans watermark (illimité)", availability: { Normal: "no", Gold: "no", Platine: "included" } },
  { label: "Multi-profil Famille (parents + 2 enfants)", availability: { Normal: "no", Gold: "no", Platine: "included" } },
  { label: "Avantage fidélité (renouvellement annuel −10%)", availability: { Normal: "no", Gold: "no", Platine: "included" } },
];

function euro(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function PlanCard({
  plan,
  period,
  highlight,
  onSelect,
}: {
  plan: PlanKey;
  period: Period;
  highlight?: "best" | "premium";
  onSelect: (plan: PlanKey, period: Period) => void;
}) {
  const base = BASE_PRICES[period][plan];
  const price = period === "Annuel" ? base * (1 - ANNUAL_DISCOUNT) : base;
  const per = period === "Annuel" ? " / mois (engagement 12 mois)" : " / mois";
  const ribbon =
    highlight === "best"
      ? "Meilleur choix"
      : highlight === "premium"
      ? "Premium"
      : null;

  const perks: Record<PlanKey, string[]> = {
    Normal: ["Essentiel pour démarrer", "Focus & révision intelligente"],
    Gold: ["Fiches perso & Parents", "Idéal pour progresser régulièrement"],
    Platine: ["Co-Pilot & Mentor", "Tout débloqué + prioritaire"],
  };

  return (
    <motion.div
      layout
      className={`relative rounded-2xl border p-5 shadow-sm bg-white ${
        highlight === "best"
          ? "border-indigo-400 shadow-indigo-100"
          : highlight === "premium"
          ? "border-emerald-400 shadow-emerald-100"
          : "border-slate-200"
      }`}
    >
      {ribbon ? (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white ${
            highlight === "best" ? "bg-indigo-600" : "bg-emerald-600"
          }`}
          aria-label={ribbon}
          title={ribbon}
        >
          {ribbon}
        </div>
      ) : null}
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xl font-bold">{plan}</h3>
        {period === "Annuel" ? (
          <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5">
            −20% annuel
          </span>
        ) : null}
      </div>
      <div className="mt-2">
        <div className="text-3xl font-extrabold">{euro(price)}</div>
        <div className="text-xs text-muted-foreground">{per}</div>
      </div>
      <ul className="mt-4 space-y-1 text-sm">
        {perks[plan].map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span aria-hidden>✅</span> {p}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan, period)}
        className={`mt-4 w-full rounded-xl px-4 py-2 font-semibold ${
          highlight === "premium"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : highlight === "best"
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        Choisir {plan}
      </button>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Changement de mode à tout moment. Paiement sécurisé.
      </p>
    </motion.div>
  );
}

export default function PricingShowcase() {
  const [period, setPeriod] = useState<Period>("Annuel");

  const goPanier = (plan: PlanKey, per: Period) => {
    const params = new URLSearchParams({ plan, period: per });
    window.location.assign(`/panier?${params.toString()}`);
  };

  const priceNote =
    period === "Annuel"
      ? "Prix mensuel après remise annuelle (engagement 12 mois)."
      : "Prix mensuel sans engagement (hors add-ons).";

  const legend: Record<"included" | "partial" | "no", React.ReactNode> = {
    included: <span title="Inclus">✅</span>,
    partial: <span title="Partiel / limité">🟨</span>,
    no: <span title="Non inclus">—</span>,
  };

  const headerCtas = useMemo(
    () => [
      { plan: "Normal" as PlanKey },
      { plan: "Gold" as PlanKey, highlight: "best" as const },
      { plan: "Platine" as PlanKey, highlight: "premium" as const },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Tarifs simples, résultats concrets
        </h1>
        <p className="text-muted-foreground">
          Compare les modes et choisis le meilleur pour ta progression.
          <span className="ml-2 inline-flex items-center rounded-full bg-sky-50 text-sky-700 text-[11px] border border-sky-200 px-2 py-0.5">
            −20% en annuel &nbsp;•&nbsp; Pack Famille −20% (≥ 2 niveaux)
          </span>
        </p>

        {/* Toggle Mensuel / Annuel */}
        <div className="inline-flex mt-4 rounded-xl border bg-white overflow-hidden">
          {(["Mensuel", "Annuel"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-semibold ${
                period === p ? "bg-slate-900 text-white" : "text-slate-700"
              }`}
              aria-pressed={period === p}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="text-[12px] text-muted-foreground mt-1">{priceNote}</div>
      </header>

      {/* Cartes plans */}
      <section className="mt-8 grid md:grid-cols-3 gap-4">
        {headerCtas.map(({ plan, highlight }) => (
          <PlanCard
            key={plan}
            plan={plan}
            period={period}
            highlight={highlight}
            onSelect={goPanier}
          />
        ))}
      </section>

      {/* Comparatif détaillé */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">Comparatif des fonctionnalités</h2>
        <div className="overflow-auto rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 w-[45%]">Fonctionnalité</th>
                <th className="text-center px-4 py-3">Normal</th>
                <th className="text-center px-4 py-3">Gold</th>
                <th className="text-center px-4 py-3">Platine</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.label} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{f.label}</div>
                    {f.details ? (
                      <div className="text-[11px] text-muted-foreground">{f.details}</div>
                    ) : null}
                  </td>
                  <td className="text-center">{legend[f.availability.Normal]}</td>
                  <td className="text-center">{legend[f.availability.Gold]}</td>
                  <td className="text-center">{legend[f.availability.Platine]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted-foreground mt-2">
          L’offre Platine inclut l’ensemble des fonctionnalités Gold + Normal, avec des services avancés et priorité support.
        </p>
      </section>

      {/* Bandeau incitation */}
      <section className="mt-10">
        <div className="rounded-2xl border p-4 bg-gradient-to-r from-indigo-50 to-emerald-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="text-sm">
              <div className="font-bold">Tu hésites entre Gold et Platine ?</div>
              <div className="text-muted-foreground">
                Gold = meilleur rapport / progression régulière. Platine = tout débloqué + Co-Pilot & Mentor + prioritaire.
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => (window.location.href = "/panier?plan=Gold&period=" + period)}
                className="rounded-xl px-4 py-2 font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Choisir Gold
              </button>
              <button
                onClick={() => (window.location.href = "/panier?plan=Platine&period=" + period)}
                className="rounded-xl px-4 py-2 font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Passer en Platine
              </button>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground mt-2">
            Prix affiché mensuel. En annuel (−20%), engagement de 12 mois. Pack Famille −20% si au moins 2 niveaux.
          </div>
        </div>
      </section>

      {/* FAQ courte */}
      <section className="mt-10 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 bg-white">
          <h3 className="font-semibold">Puis-je changer de plan plus tard ?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Oui, à tout moment. Le passage à Gold/Platine débloque immédiatement les fonctionnalités associées.
          </p>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <h3 className="font-semibold">Comment fonctionne l’annuel (−20%) ?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Le prix est lissé au mois pour l’affichage, mais l’abonnement est avec un engagement de 12 mois.
          </p>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <h3 className="font-semibold">Pack Famille ?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoute au moins un autre niveau (ex: 4e + 2nde) pour activer −20% supplémentaires. Cumulable avec l’annuel (Méga Pack −30%).
          </p>
        </div>
      </section>
    </div>
  );
}
