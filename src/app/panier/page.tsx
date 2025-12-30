"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "normal" | "gold" | "platine" | "family";
type Duration = "monthly" | "annual";

type UpsellKey = "parents" | "coach" | "pdf" | "ia";
type ThemePack = "mario" | "onepiece";
type Skin = "neon" | "solaire" | "pastel";
/*__SS_ADDONS_TYPES__*/
type LearningAddon = "tdah" | "dys" | "tsa" | "hpi";

const LEARNING_ADDON_PRICE_MONTHLY = 2.99; // abonnement (mensuel ou annuel)
const SKIN_PRICE_ONE_TIME = 2.99;          // achat unique

const LEARNING_ADDONS: Array<{ key: LearningAddon; label: string; desc: string }> = [
  { key: "tdah", label: "TDAH", desc: "Timers + micro-étapes + anti-distraction" },
  { key: "dys",  label: "DYS",  desc: "Typo adaptée + consignes simplifiées" },
  { key: "tsa",  label: "TSA",  desc: "Structure + prévisibilité + feedback stable" },
  { key: "hpi",  label: "HPI",  desc: "Parcours accéléré + défis avancés" },
];

type CartItem = { id: string; level: string; subject: string };

const PLAN_META: Record<Plan, { label: string; monthly: number }> = {
  normal: { label: "Normal", monthly: 12.49 },
  gold: { label: "Gold", monthly: 19.99 },
  platine: { label: "Platine", monthly: 24.99 },
  family: { label: "Famille", monthly: 36.25 },
};

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];
const SUBJECTS = ["Maths", "Physique-Chimie", "SVT", "Français", "Histoire-Géo"];

const UPSELLS: Array<{ key: UpsellKey; label: string; desc: string; monthly: number }> = [
  { key: "parents", label: "Parents+", desc: "Tableau de bord parents + suivi", monthly: 6 },
  { key: "coach", label: "Coach hebdo", desc: "Mini-plan personnalisé / semaine", monthly: 9 },
  { key: "pdf", label: "Fiches PDF", desc: "Téléchargements illimités", monthly: 4 },
  { key: "ia", label: "Assistant IA", desc: "Aide pas-à-pas (limité)", monthly: 5 },
];

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}
function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}
function readPlan(p: string | null): Plan {
  if (p === "normal" || p === "gold" || p === "platine" || p === "family") return p;
  return "gold";
}

export default function PanierPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // ✅ PROD : pas de switch visitor/subscribed (c’était dev only)
  const [tab, setTab] = useState<"subjects" | "themes" | "learning" | "chapters">("subjects");
  const [plan, setPlan] = useState<Plan>(readPlan(sp.get("plan")));
  const [duration, setDuration] = useState<Duration>("annual");

  const [items, setItems] = useState<CartItem[]>([{ id: "i1", level: "4e", subject: "Physique-Chimie" }]);
  const [selectedUpsells, setSelectedUpsells] = useState<Record<UpsellKey, boolean>>({
    parents: false,
    coach: false,
    pdf: false,
    ia: false,
  });

  /*__SS_ADDONS_STATE__*/
  const [selectedLearning, setSelectedLearning] = useState<Record<LearningAddon, boolean>>({
    tdah: false, dys: false, tsa: false, hpi: false,
  });

  // achat unique: on peut acheter 1+ skins (même si on en "utilise" un seul)
  const [purchasedSkins, setPurchasedSkins] = useState<Record<Skin, boolean>>({
    neon: false, solaire: false, pastel: false,
  });

  // ✅ PROD : pas d’ownership mock (tout est “non acheté” tant qu’on n’a pas le backend)
  const owned = useMemo(() => {
    return {
      parentsOwned: false,
      themeOwned: {} as Partial<Record<ThemePack, boolean>>,
      skinOwned: {} as Partial<Record<Skin, boolean>>,
    };
  }, []);

  // Thème/skin : on lit le choix global sauvegardé (home)
  const [themePack, setThemePack] = useState<ThemePack>("mario");
  const [skin, setSkin] = useState<Skin>("neon");
  useEffect(() => {
    try {
      const t = localStorage.getItem("ss_theme_pack");
      const s = localStorage.getItem("ss_ui_skin");
      if (t === "mario" || t === "onepiece") setThemePack(t);
      if (s === "neon" || s === "solaire" || s === "pastel") setSkin(s);
    } catch {}
  }, []);

  // garde plan dans l’URL (pratique)
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("plan", plan);
    router.replace(`/panier?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const annualDiscountActive = duration === "annual";
  const annualDiscountRate = annualDiscountActive ? 0.2 : 0;

    // Remise famille: uniquement si au moins 2 niveaux différents
  const levelCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const it of items) m[it.level] = (m[it.level] || 0) + 1;
    return m;
  }, [items]);

  const uniqueLevelsCount = useMemo(() => Object.keys(levelCounts).length, [levelCounts]);

  const familyDiscountEligible = uniqueLevelsCount >= 2;
  const familyDiscountActive = familyDiscountEligible && plan !== "family";

  // Remise matières (même niveau): dès 3 matières dans le même niveau => -10%
  // (non cumulable avec la remise famille)
  const bulkSameLevelActive = !familyDiscountActive && Object.values(levelCounts).some((n) => n >= 3);
  const bulkSameLevelRate = 0.10;

  const baseMonthly = PLAN_META[plan].monthly * items.length;

  /*__SS_PARENTS_INCLUDED__*/
  const parentsIncluded = plan === "gold" || plan === "platine";

  // Auto-coché si inclus (et non facturé)
  useEffect(() => {
    if (!parentsIncluded) return;
    setSelectedUpsells((p) => ({ ...p, parents: true }));
  }, [parentsIncluded]);

  const upsellMonthly = useMemo(() => {
    let t = 0;
    for (const u of UPSELLS) {
      if (!selectedUpsells[u.key]) continue;
      if (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) continue;
      t += u.monthly;
    }
    return t;
  }, [selectedUpsells, owned.parentsOwned, parentsIncluded]);

  const learningMonthly = useMemo(() => {
    const n = Object.values(selectedLearning).filter(Boolean).length;
    return Math.round(n * LEARNING_ADDON_PRICE_MONTHLY * 100) / 100;
  }, [selectedLearning]);

  const skinsOneTime = useMemo(() => {
    const n = Object.values(purchasedSkins).filter(Boolean).length;
    return Math.round(n * SKIN_PRICE_ONE_TIME * 100) / 100;
  }, [purchasedSkins]);

  /*__SS_ADDONS_TOTALS__*/
  const totalMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    // Remises non cumulables: famille prioritaire, sinon bulk même niveau
    if (familyDiscountActive) {
      t = t * 0.8;
    } else if (bulkSameLevelActive) {
      t = t * (1 - bulkSameLevelRate);
    }
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate]);

  /*__SS_DISCOUNT_DISPLAY__*/
  // Pour l'affichage du récap: montant mensuel AVANT remise famille / bulk (mais après remise annuelle si active)
  const beforeLevelDiscountMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate]);

  const familyDiscountMonthlyValue = useMemo(() => {
    if (!familyDiscountActive) return 0;
    // -20% sur le total avant remise famille (après annuel)
    return Math.round(beforeLevelDiscountMonthly * 0.20 * 100) / 100;
  }, [familyDiscountActive, beforeLevelDiscountMonthly]);

  const bulkSameLevelDiscountMonthlyValue = useMemo(() => {
    if (!bulkSameLevelActive) return 0;
    return Math.round(beforeLevelDiscountMonthly * bulkSameLevelRate * 100) / 100;
  }, [bulkSameLevelActive, beforeLevelDiscountMonthly, bulkSameLevelRate]);


  // Total facturé aujourd’hui = abonnement (mensuel ou annuel) + achats uniques (skins)
  const totalDueToday = useMemo(() => {
    // Recalc autonome (évite toute dépendance d'ordre à totalMonthly)
    let recurring = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) recurring = recurring * (1 - annualDiscountRate);
    if (familyDiscountActive) {
      recurring = recurring * 0.8;
    } else if (bulkSameLevelActive) {
      recurring = recurring * (1 - bulkSameLevelRate);
    }
    recurring = Math.round(recurring * 100) / 100;

    const recurringCharge = duration === "annual" ? recurring * 12 : recurring;
    const t = recurringCharge + skinsOneTime;
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate, duration, skinsOneTime]);


  /*__SS_RIGHT_RECAP_MODEL__*/
  // --- Modèle récap (onglet + global) ---
  const selectedUpsellsMonthly = useMemo(() => {
    return UPSELLS
      .filter((u) => selectedUpsells[u.key])
      .map((u) => ({
        key: u.key,
        label: u.label,
        monthly: (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) ? 0 : u.monthly,
        included: (u.key === "parents" && parentsIncluded) ? true : false,
        owned: (u.key === "parents" && owned.parentsOwned) ? true : false,
      }))
      .filter((u) => u.monthly > 0 || u.included || u.owned);
  }, [selectedUpsells, parentsIncluded, owned.parentsOwned]);

  const selectedLearningList = useMemo(() => {
    return Object.entries(selectedLearning)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [selectedLearning]);

  const purchasedSkinsList = useMemo(() => {
    return Object.entries(purchasedSkins)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [purchasedSkins]);

  const itemsByLevel = useMemo(() => {
    const m: Record<string, Array<string>> = {};
    for (const it of items) {
      m[it.level] = m[it.level] || [];
      m[it.level].push(it.subject);
    }
    return m;
  }, [items]);

  const tabRecap = useMemo(() => {
    // Récap “ce que tu touches maintenant” selon l’onglet
    if (tab === "subjects") {
      return {
        title: "Récap onglet — Matières",
        lines: [
          { label: `${items.length} matière(s) sélectionnée(s)`, value: null },
          ...Object.entries(itemsByLevel).map(([lvl, subs]) => ({
            label: lvl,
            value: subs.join(", "),
          })),
          { label: "Sous-total abonnement (base)", value: money(baseMonthly) + "/mois" },
        ],
      };
    }

    if (tab === "themes") {
      return {
        title: "Récap onglet — Thèmes & skins",
        lines: [
          { label: "Thème actif", value: themePack },
          { label: "Skin actif", value: skin },
          { label: "Skins achetés (unique)", value: purchasedSkinsList.join(", ") || "—" },
          { label: "Sous-total achats uniques", value: money(skinsOneTime) },
        ],
      };
    }

    if (tab === "learning") {
      return {
        title: "Récap onglet — Modes d’apprentissage",
        lines: [
          { label: "Modes choisis", value: selectedLearningList.map((x) => x.toUpperCase()).join(", ") || "—" },
          { label: "Sous-total modes", value: money(learningMonthly) + "/mois" },
          { label: "Rappel", value: "Renouvelé mensuellement (ou annuel si Annuel)" },
        ],
      };
    }

    // chapters (placeholder)
    return {
      title: "Récap onglet — Chapitres",
      lines: [
        { label: "Bientôt disponible", value: "Achat à l’unité par chapitre" },
      ],
    };
  }, [tab, items.length, itemsByLevel, baseMonthly, themePack, skin, purchasedSkinsList, skinsOneTime, selectedLearningList, learningMonthly]);

  const globalRecap = useMemo(() => {
    const lines: Array<{ label: string; value?: string; tone?: "muted" | "good" | "bad" }> = [];

    // Base
    lines.push({ label: `Abonnement ${PLAN_META[plan].label} × ${items.length} matière(s)`, value: money(baseMonthly) + "/mois" });

    // Upsells
    if (selectedUpsellsMonthly.length) {
      for (const u of selectedUpsellsMonthly) {
        if (u.included) lines.push({ label: `${u.label}`, value: "Inclus", tone: "good" });
        else if (u.owned) lines.push({ label: `${u.label}`, value: "Déjà acheté", tone: "good" });
        else lines.push({ label: `${u.label}`, value: money(u.monthly) + "/mois" });
      }
    }

    // Learning
    if (learningMonthly > 0) {
      lines.push({ label: `Modes d’apprentissage (${selectedLearningList.length})`, value: money(learningMonthly) + "/mois" });
    }

    // Achats uniques
    if (skinsOneTime > 0) {
      lines.push({ label: `Skins (achat unique)`, value: money(skinsOneTime) });
    }

    // Remises (affichage “comme famille”)
    if (familyDiscountActive && typeof familyDiscountMonthlyValue !== "undefined" && familyDiscountMonthlyValue > 0) {
      lines.push({ label: "Remise Famille (-20%)", value: "- " + money(familyDiscountMonthlyValue), tone: "good" });
    }
    if (bulkSameLevelActive && typeof bulkSameLevelDiscountMonthlyValue !== "undefined" && bulkSameLevelDiscountMonthlyValue > 0) {
      lines.push({ label: "Remise matières (≥3 même niveau) (-10%)", value: "- " + money(bulkSameLevelDiscountMonthlyValue), tone: "good" });
    }

    // Totaux
    lines.push({ label: "Total abonnement", value: money(totalMonthly) + "/mois" });
    lines.push({ label: "Total aujourd’hui", value: money(totalDueToday), tone: "bad" });

    return { title: "Récap général", lines };
  }, [
    plan,
    items.length,
    baseMonthly,
    selectedUpsellsMonthly,
    learningMonthly,
    selectedLearningList.length,
    skinsOneTime,
    familyDiscountActive,
    bulkSameLevelActive,
    typeof familyDiscountMonthlyValue !== "undefined" ? familyDiscountMonthlyValue : 0,
    typeof bulkSameLevelDiscountMonthlyValue !== "undefined" ? bulkSameLevelDiscountMonthlyValue : 0,
    totalMonthly,
    totalDueToday,
  ]);



  const addItem = () => {
    const id = `i${Math.random().toString(16).slice(2)}`;
    setItems((p) => [...p, { id, level: "5e", subject: "Maths" }]);
  };
  const removeItem = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const updateItem = (id: string, patch: Partial<CartItem>) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const toggleUpsell = (k: UpsellKey) => {
    if (k === "parents" && parentsIncluded) return;
    if (k === "parents" && owned.parentsOwned) return;
    setSelectedUpsells((p) => ({ ...p, [k]: !p[k] }));
  };

  const checkout = () => {
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("duration", duration);
    params.set("items", items.map((i) => `${i.level}:${i.subject}`).join("|"));

    const ups = Object.entries(selectedUpsells)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
    if (ups) params.set("upsells", ups);

    const learn = Object.entries(selectedLearning).filter(([,v]) => v).map(([k]) => k).join(",");
    if (learn) params.set("learning", learn);

    const skins = Object.entries(purchasedSkins).filter(([,v]) => v).map(([k]) => k).join(",");
    if (skins) params.set("skins", skins);

    params.set("theme", themePack);
    params.set("skin", skin);

    /*__SS_ADDONS_CHECKOUT__*/

    router.push(`/panier/confirmation?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header simple (on harmonisera ensuite au niveau global) */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="font-semibold text-slate-900">Site Sciences</a>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <a className="hover:text-slate-900" href="/">Accueil</a>
            <a className="hover:text-slate-900" href="/tarifs">Tarifs</a>
            <a className="hover:text-slate-900" href="/contact">Contact</a>
            <a className="hover:text-slate-900" href="/mon-compte">Mon compte</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Progress (conversion) */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs text-slate-500">Parcours</div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">1 Tarifs</span>
            <span className="h-[2px] flex-1 bg-slate-200" />
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">2 Paiement</span>
            <span className="h-[2px] flex-1 bg-slate-200" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">3 Confirmation</span>
          </div>
          <div className="mt-3 text-sm text-slate-600">Objectif : finaliser en 2 minutes. Paiement sécurisé.</div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Mon panier</h1>
          <p className="text-slate-600">Choisis ta formule, puis personnalise avec options / thèmes / modes.</p>
        </div>

        {/* Tabs */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { k: "subjects", label: "Matières par niveau" },
              { k: "themes", label: "Thèmes visuels" },
              { k: "learning", label: "Modes d’apprentissage" },
              { k: "chapters", label: "Achat par chapitre" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as any)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm transition",
                  tab === t.k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

        {/*__SS_ADDONS_UI__*/}
        {tab === "themes" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Skins (achat unique)</div>
              <div className="mt-1 text-sm text-slate-600">
                Un skin acheté est disponible définitivement. Prix: {money(SKIN_PRICE_ONE_TIME)} / skin.
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(["neon","solaire","pastel"] as const).map((k) => (
                  <div key={k} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        className={cn("text-sm font-semibold", skin === k ? "text-slate-900" : "text-slate-700")}
                        onClick={() => setSkin(k)}
                        type="button"
                      >
                        Skin {k}
                      </button>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={!!purchasedSkins[k]}
                          onChange={() => setPurchasedSkins((p) => ({ ...p, [k]: !p[k] }))}
                        />
                        Acheter ({money(SKIN_PRICE_ONE_TIME)})
                      </label>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Actif: {skin === k ? "oui" : "non"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap achat unique</div>
              <div className="mt-3 text-sm text-slate-700">
                Skins achetés:
                <div className="mt-1 text-slate-600">
                  {Object.entries(purchasedSkins).filter(([,v]) => v).map(([k]) => k).join(", ") || "—"}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                Total skins (unique): <span className="font-semibold">{money(skinsOneTime)}</span>
              </div>
            </aside>
          </div>
        ) : null}

        {tab === "learning" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Modes d’apprentissage (abonnement)</div>
              <div className="mt-1 text-sm text-slate-600">
                {money(LEARNING_ADDON_PRICE_MONTHLY)} / mois / mode. Renouvellement mensuel (ou annuel si Annuel).
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {LEARNING_ADDONS.map((a) => (
                  <label key={a.key} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <input
                      type="checkbox"
                      checked={!!selectedLearning[a.key]}
                      onChange={() => setSelectedLearning((p) => ({ ...p, [a.key]: !p[a.key] }))}
                    />
                    <div>
                      <div className="text-sm font-semibold">{a.label}</div>
                      <div className="text-xs text-slate-600">{a.desc}</div>
                    </div>
                    <div className="ml-auto text-sm font-semibold">{money(LEARNING_ADDON_PRICE_MONTHLY)}/mois</div>
                  </label>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap abonnement</div>
              <div className="mt-3 text-sm text-slate-700">
                Modes choisis:
                <div className="mt-1 text-slate-600">
                  {Object.entries(selectedLearning).filter(([,v]) => v).map(([k]) => k.toUpperCase()).join(", ") || "—"}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                Total modes (€/mois): <span className="font-semibold">{money(learningMonthly)}</span>
              </div>
            </aside>
          </div>
        ) : null}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Plan + durée */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Formule</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as Plan)}
                  >
                    <option value="gold">Gold</option>
                    <option value="platine">Platine</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Durée</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as Duration)}
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="annual">Annuel (-20%)</option>
                  </select>
                </div>
              </div>

              {tab === "subjects" ? (
                <>
                  <p className="mt-4 text-sm text-slate-600">
                    Choisis <span className="font-semibold text-slate-900">niveau + matière</span> pour chaque abonnement.
                  </p>

                  <div className="mt-4 space-y-3">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center"
                      >
                        <div className="flex flex-1 flex-col gap-3 md:flex-row">
                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm md:w-40"
                            value={it.level}
                            onChange={(e) => updateItem(it.id, { level: e.target.value })}
                          >
                            {LEVELS.map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>

                          <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={it.subject}
                            onChange={(e) => updateItem(it.id, { subject: e.target.value })}
                          >
                            {SUBJECTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addItem}
                    className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    + Ajouter une matière/niveau
                  </button>
                </>
              ) : (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Onglet <span className="font-semibold text-slate-900">“{tab}”</span> : (mock UI validé) — branchement plus tard.
                </div>
              )}
            </section>

            {/* Options */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">Options</h2>
              <div className="mt-4 grid gap-3">
                {UPSELLS.map((u) => {
                  const checked = !!selectedUpsells[u.key];
                  const isOwned = u.key === "parents" && owned.parentsOwned;
                  return (
                    <button
                      key={u.key}
                      onClick={() => toggleUpsell(u.key)}
                      className={cn(
                        "flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition",
                        isOwned ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      )}
                      aria-disabled={isOwned}
                    >
                      <div className="flex gap-3">
                        <div className={cn("mt-1 h-5 w-5 rounded-md border", checked ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white")} />
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{u.label}</div>
                            {isOwned ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                                Déjà acheté
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">{u.desc}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-700">{isOwned ? "Inclus" : `+ ${money(u.monthly)}/mois`}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right recap sticky */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap</div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{PLAN_META[plan].label}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {items.length} sélection{items.length > 1 ? "s" : ""} • {duration === "annual" ? "Annuel (-20%)" : "Mensuel"}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Thème {themePack} • Skin {skin}</div>
                    {familyDiscountEligible && plan !== "family" ? (
                      <div className="mt-2 text-xs text-emerald-700">Pack Famille activé (-20%)</div>
                    ) : null}
                  </div>
                  <div className="text-lg font-semibold">
{bulkSameLevelActive ? (
  <div className="mt-2 flex items-center justify-between text-sm">
    <div className="text-slate-600">Remise matières (≥ 3 même niveau) (-10%)</div>
    <div className="font-semibold text-emerald-700">- {money(bulkSameLevelDiscountMonthlyValue)}</div>
  </div>
) : null}
{/*__SS_BULK_RECAP_LINE__*/}

{/*__SS_RIGHT_RECAP_UI__*/}
<div className="mt-4 grid gap-3">
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs text-slate-500">Récap onglet</div>
    <div className="mt-1 text-sm font-semibold text-slate-900">{tabRecap.title}</div>
    <div className="mt-3 space-y-2">
      {tabRecap.lines.map((l, idx) => (
        <div key={idx} className="flex items-start justify-between gap-3 text-sm">
          <div className="text-slate-600">{l.label}</div>
          {l.value ? <div className="text-right font-semibold text-slate-900">{l.value}</div> : <div />}
        </div>
      ))}
    </div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs text-slate-500">Récap général</div>
    <div className="mt-1 text-sm font-semibold text-slate-900">{globalRecap.title}</div>

    <div className="mt-3 space-y-2">
      {globalRecap.lines.map((l, idx) => (
        <div key={idx} className="flex items-start justify-between gap-3 text-sm">
          <div className="text-slate-600">{l.label}</div>
          {l.value ? (
            <div
              className={
                "text-right font-semibold " +
                (l.tone === "good" ? "text-emerald-700" : l.tone === "bad" ? "text-slate-900" : "text-slate-900")
              }
            >
              {l.value}
            </div>
          ) : (
            <div />
          )}
        </div>
      ))}
    </div>

    <div className="mt-3 text-xs text-slate-500">
      Total abonnement = €/mois. Total aujourd’hui = (mensuel ou annuel) + achats uniques.
    </div>
  </div>
</div>

{money(totalMonthly)}
</div>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600">
                  ✅ Accès immédiat • ✅ Résiliation simple • ✅ Support rapide
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
  <div className="text-xs text-slate-500">Total aujourd’hui</div>
  <div className="mt-1 flex items-baseline justify-between gap-3">
    <div className="text-sm text-slate-600">
      {duration === "annual" ? "Abonnement annuel (12 mois) + achats uniques" : "Abonnement mensuel + achats uniques"}
    </div>
    <div className="text-xl font-semibold">{money(totalDueToday)}</div>
  </div>
  <div className="mt-1 text-xs text-slate-500">
    Achats uniques (skins): {money(skinsOneTime)} — Options abonnement (modes): {money(learningMonthly)}/mois
  </div>
</div>

<button
                onClick={checkout}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Continuer → Confirmation
              </button>
{/* __SS_ADDONS_TOTALTODAY_UI__ */}

              <a className="mt-3 block text-center text-sm text-slate-600 hover:text-slate-900" href="/tarifs">
                ← Retour Tarifs
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
