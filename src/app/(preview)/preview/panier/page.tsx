"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PlanId = "gold" | "platine" | "family";
type Mode = "visitor" | "subscribed";

type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: number;
  highlight: string;
  bestFor: string;
  includes: string[];
  badge?: string;
};

const PLANS: Record<PlanId, Plan> = {
  gold: {
    id: "gold",
    name: "Gold",
    priceMonthly: 9.99,
    highlight: "Le plus populaire",
    bestFor: "Collège & Lycée",
    includes: [
      "Programme officiel couvert",
      "Exercices gamifiés illimités",
      "Suivi intelligent de progression",
      "Espace parents (basique)",
    ],
    badge: "⭐ Populaire",
  },
  platine: {
    id: "platine",
    name: "Platine",
    priceMonthly: 14.99,
    highlight: "Performance max",
    bestFor: "Brevet / Bac / révisions intensives",
    includes: [
      "Tout Gold inclus",
      "Coaching & plans de révision",
      "Multi-joueur / duels",
      "Analyses avancées",
    ],
    badge: "⚡ Recommandé",
  },
  family: {
    id: "family",
    name: "Famille",
    priceMonthly: 19.99,
    highlight: "Jusqu’à 4 profils",
    bestFor: "Fratries & parents impliqués",
    includes: [
      "Tout Platine inclus",
      "Jusqu’à 4 profils enfants",
      "Espace parents avancé",
      "Gestion multi-enfants",
    ],
    badge: "👨‍👩‍👧‍👦 Famille",
  },
};

type ThemeOptionId = "mario_pack" | "onepiece_pack";
type SkinOptionId = "neon" | "solaire" | "pastel";

function eur(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function PreviewPanierPage() {
  const router = useRouter();
  const params = useSearchParams();

  const plan = ((params.get("plan") as PlanId) || "gold") satisfies PlanId;
  const initialMode = ((params.get("mode") as Mode) || "visitor") satisfies Mode;

  const [mode, setMode] = useState<Mode>(initialMode);

  // Upsells / options (mock)
  const [annual, setAnnual] = useState(false);
  const [parentsPlus, setParentsPlus] = useState(false);

  // Options thèmes/skins (mock)
  const [themePack, setThemePack] = useState<ThemeOptionId | "none">("none");
  const [skin, setSkin] = useState<SkinOptionId | "default">("default");

  // Paiement mock
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const p = useMemo(() => PLANS[plan], [plan]);

  /**
   * Mock "déjà acheté"
   * - En mode abonné, on simule que certains achats existent déjà
   * - Exemple demandé: option parents déjà achetée → case cochée + bloquée + pas ajoutée au prix
   */
  const owned = useMemo(() => {
    const isSubscribed = mode === "subscribed";
    return {
      parentsPlus: isSubscribed && (plan === "platine" || plan === "family"), // mock : les abonnés Platine/Famille l'ont déjà
      marioPack: isSubscribed, // mock : déjà acheté pour un abonné
      onepiecePack: isSubscribed && plan === "family", // mock : famille a tout
      skinNeon: isSubscribed, // mock
      skinSolaire: false, // mock
      skinPastel: isSubscribed && plan !== "gold", // mock
    };
  }, [mode, plan]);

  // Si déjà acheté → on force l’état visuel (coché) mais sans interaction
  const parentsPlusChecked = owned.parentsPlus ? true : parentsPlus;

  // Si déjà acheté → on impose des sélections “déjà possédées” (optionnel, pure UX)
  useEffect(() => {
    if (owned.marioPack) setThemePack((prev) => (prev === "none" ? "mario_pack" : prev));
    if (owned.skinNeon) setSkin((prev) => (prev === "default" ? "neon" : prev));
  }, [owned.marioPack, owned.skinNeon]);

  const baseMonthly = p.priceMonthly;

  // Prix option parents : seulement si sélectionnée ET pas déjà achetée
  const parentsPlusMonthly = parentsPlusChecked && !owned.parentsPlus ? 2.99 : 0;

  const monthlyTotal = baseMonthly + parentsPlusMonthly;

  const annualDiscountRate = 0.15; // -15% mock
  const annualTotal = Math.max(0, monthlyTotal * 12 * (1 - annualDiscountRate));

  const totalLabel = annual ? `${eur(annualTotal)} / an` : `${eur(monthlyTotal)} / mois`;

  const subLabel =
    mode === "visitor"
      ? "Sans engagement • Annulation en 2 clics"
      : "Changement d’offre simulé • Progression conservée";

  const cta = mode === "visitor" ? "Valider & payer (mock)" : "Confirmer le changement (mock)";

  const canSubmit =
    cardNumber.trim().length >= 12 &&
    cardName.trim().length >= 3 &&
    cardExp.trim().length >= 4 &&
    cardCvc.trim().length >= 3;

  const themePackLabel =
    themePack === "mario_pack" ? "Pack Mario" : themePack === "onepiece_pack" ? "Pack One Piece" : "Aucun";
  const skinLabel =
    skin === "neon" ? "Skin Neon" : skin === "solaire" ? "Skin Solaire" : skin === "pastel" ? "Skin Pastel" : "Default";

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {/* Top */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Checkout Preview
              </span>
              <span className="text-xs text-slate-400">{subLabel}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Finaliser en{" "}
              <span className="text-emerald-200 underline decoration-emerald-400/60 decoration-2 underline-offset-4">
                30 secondes
              </span>
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Récap clair, paiement mock, et garanties visibles pour maximiser la conversion.
            </p>
          </div>

          {/* Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400">Vue :</span>
            <div className="inline-flex rounded-full bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode("visitor")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === "visitor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                Visiteur
              </button>
              <button
                type="button"
                onClick={() => setMode("subscribed")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === "subscribed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                Déjà abonné
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tarifs</span>
            <span>Paiement</span>
            <span>Confirmation</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-white/10">
            <div className="h-2 w-2/3 rounded-full bg-emerald-400/80" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          {/* Left */}
          <div className="space-y-6">
            {/* Offer */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                      {p.badge ?? "Offre"}
                    </span>
                    <span className="text-xs text-slate-400">{p.bestFor}</span>
                  </div>
                  <h2 className="text-lg font-semibold md:text-xl">
                    {p.name} — <span className="text-slate-200">{p.highlight}</span>
                  </h2>
                  <p className="text-sm text-slate-300">{p.includes.slice(0, 2).join(" • ")} • …</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-right">
                  <div className="text-sm text-slate-400">Total</div>
                  <div className="text-xl font-semibold text-white">{totalLabel}</div>
                  <div className="text-[11px] text-slate-400">
                    {annual ? "Économisez ~15% (mock)" : "Mensuel • sans engagement"}
                  </div>
                </div>
              </div>

              {mode === "subscribed" && (
                <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                  <div className="font-semibold">Changement d’abonnement</div>
                  <div className="mt-1 text-xs text-amber-200/90">
                    Votre progression est conservée. Un email de confirmation sera envoyé (mock).
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-slate-200">Inclus</div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {p.includes.map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-300">✓</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-slate-200">Garanties</div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">🔒</span>
                      <span>Paiement sécurisé (mock)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">🧾</span>
                      <span>Factures dans “Mon compte”</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">⏱️</span>
                      <span>Activation instantanée</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Options (upsell) */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-sm font-semibold text-white">Optimiser votre offre</h3>
              <p className="mt-1 text-xs text-slate-400">Options mock pour augmenter la valeur perçue.</p>

              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b0b0c] p-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">Paiement annuel (-15%)</div>
                    <div className="text-xs text-slate-400">Meilleur rapport qualité/prix • recommandé</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={annual}
                    onChange={(e) => setAnnual(e.target.checked)}
                    className="h-5 w-5 accent-emerald-400"
                  />
                </label>

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-100">
                          Espace Parents+ (+{eur(2.99)}/mois)
                        </div>
                        {owned.parentsPlus && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                            Déjà acheté
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        Rapports hebdo, objectifs & alertes (mock)
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={parentsPlusChecked}
                      disabled={owned.parentsPlus}
                      onChange={(e) => setParentsPlus(e.target.checked)}
                      className={`h-5 w-5 accent-emerald-400 ${owned.parentsPlus ? "cursor-not-allowed opacity-60" : ""}`}
                    />
                  </div>

                  {owned.parentsPlus && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      Option déjà incluse/achetée : aucun coût supplémentaire.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* NEW: Thèmes / Skins */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Thèmes & Skins</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Personnalisation mock (idéal pour booster conversion via “cosmétique”).
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-[#0b0b0c] px-3 py-1 text-xs text-slate-300">
                  🎨 Cosmetics
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {/* Theme packs */}
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-4">
                  <div className="text-xs font-semibold text-slate-200">Pack de thème</div>

                  <div className="mt-3 space-y-2">
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-100">Pack Mario</div>
                        <div className="text-xs text-slate-400">UI + ambiance + badges (mock)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {owned.marioPack && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                            Déjà acheté
                          </span>
                        )}
                        <input
                          type="radio"
                          name="themePack"
                          checked={owned.marioPack ? true : themePack === "mario_pack"}
                          disabled={owned.marioPack}
                          onChange={() => setThemePack("mario_pack")}
                          className={`h-4 w-4 accent-emerald-400 ${owned.marioPack ? "cursor-not-allowed opacity-60" : ""}`}
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-100">Pack One Piece</div>
                        <div className="text-xs text-slate-400">UI + ambiance + défis (mock)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {owned.onepiecePack && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                            Déjà acheté
                          </span>
                        )}
                        <input
                          type="radio"
                          name="themePack"
                          checked={owned.onepiecePack ? true : themePack === "onepiece_pack"}
                          disabled={owned.onepiecePack}
                          onChange={() => setThemePack("onepiece_pack")}
                          className={`h-4 w-4 accent-emerald-400 ${owned.onepiecePack ? "cursor-not-allowed opacity-60" : ""}`}
                        />
                      </div>
                    </label>

                    <button
                      type="button"
                      onClick={() => setThemePack("none")}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
                    >
                      Ne pas choisir de pack
                    </button>
                  </div>
                </div>

                {/* Skins */}
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-4">
                  <div className="text-xs font-semibold text-slate-200">Skin UI</div>
                  <div className="mt-3 space-y-2">
                    {([
                      { id: "neon", label: "Neon", owned: owned.skinNeon },
                      { id: "solaire", label: "Solaire", owned: owned.skinSolaire },
                      { id: "pastel", label: "Pastel", owned: owned.skinPastel },
                    ] as Array<{ id: SkinOptionId; label: string; owned: boolean }>).map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-slate-100">Skin {s.label}</div>
                          {s.owned && (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                              Déjà acheté
                            </span>
                          )}
                        </div>

                        <input
                          type="radio"
                          name="skin"
                          checked={s.owned ? true : skin === s.id}
                          disabled={s.owned}
                          onChange={() => setSkin(s.id)}
                          className={`h-4 w-4 accent-emerald-400 ${s.owned ? "cursor-not-allowed opacity-60" : ""}`}
                        />
                      </label>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSkin("default")}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10"
                    >
                      Revenir au skin par défaut
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment form (mock) */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Paiement</h3>
                  <p className="mt-1 text-xs text-slate-400">Formulaire mock (pour UX). Rien n’est facturé.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-[#0b0b0c] px-3 py-1 text-xs text-slate-300">🔒 SSL</span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300">Numéro de carte</label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/40"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300">Nom sur la carte</label>
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Marc Champenois"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/40"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300">Expiration</label>
                  <input
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="MM/AA"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/40"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300">CVC</label>
                  <input
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-[#0b0b0c] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/40"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-[11px] text-slate-400">
                  En cliquant, vous serez redirigé vers une confirmation mock.
                </div>

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() =>
                    router.push(
                      `/preview/panier/confirmation?plan=${plan}&mode=${mode}&annual=${annual ? "1" : "0"}&parentsPlus=${parentsPlusChecked ? "1" : "0"}&parentsOwned=${owned.parentsPlus ? "1" : "0"}&themePack=${themePack}&skin=${skin}`
                    )
                  }
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    canSubmit
                      ? "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
                      : "bg-white/10 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {cta}
                </button>
              </div>
            </section>
          </div>

          {/* Right: Sticky summary */}
          <aside className="md:sticky md:top-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">Votre sélection</div>
                  <div className="mt-1 text-lg font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.bestFor}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] px-3 py-2 text-right">
                  <div className="text-xs text-slate-400">Total</div>
                  <div className="text-sm font-semibold text-white">{totalLabel}</div>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Offre</span>
                  <span className="font-semibold text-slate-100">{eur(baseMonthly)} / mois</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    Espace Parents+{" "}
                    {owned.parentsPlus && (
                      <span className="ml-1 text-[11px] text-emerald-200">(déjà acheté)</span>
                    )}
                  </span>
                  <span className="font-semibold text-slate-100">
                    {parentsPlusChecked
                      ? owned.parentsPlus
                        ? "Inclus"
                        : `${eur(2.99)} / mois`
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Pack thème</span>
                  <span className="font-semibold text-slate-100">{themePackLabel}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Skin</span>
                  <span className="font-semibold text-slate-100">{skinLabel}</span>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{annual ? "Total annuel" : "Total mensuel"}</span>
                  <span className="text-sm font-semibold text-white">
                    {annual ? eur(annualTotal) : eur(monthlyTotal)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-xs text-emerald-100">
                <div className="font-semibold">Pourquoi ça convertit</div>
                <ul className="mt-2 space-y-1 text-emerald-100/90">
                  <li>• CTA clair + garanties visibles</li>
                  <li>• Récap sticky (réassurance)</li>
                  <li>• Cosmétique (thèmes/skins) = upsell naturel</li>
                </ul>
              </div>

              <div className="mt-5 text-[11px] text-slate-400">
                Test rapide :{" "}
                <span className="text-slate-200">/preview/panier?plan=platine&mode=subscribed</span>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold text-slate-200">Avis (mock)</div>
              <div className="mt-3 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 text-xs text-slate-300">
                  “Mon fils s’y met sans qu’on le pousse.” <span className="text-slate-400">— Parent</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 text-xs text-slate-300">
                  “J’ai progressé en 2 semaines sur mes points faibles.” <span className="text-slate-400">— Élève</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer nav */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => router.push(`/preview/tarifs`)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
          >
            ← Retour tarifs
          </button>
          <div className="text-[11px]">Preview uniquement • aucune transaction • design orienté conversion</div>
        </div>
      </div>
    </main>
  );
}
