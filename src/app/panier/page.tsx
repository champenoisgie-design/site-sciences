"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "normal" | "gold" | "platine" | "family";
type Duration = "monthly" | "annual";

type UpsellKey = "parents" | "coach" | "pdf" | "ia";
type ThemePack = "mario" | "onepiece";
type Skin = "neon" | "solaire" | "pastel";

type CartItem = { id: string; level: string; subject: string };

const PLAN_META: Record<Plan, { label: string; monthly: number }> = {
  normal: { label: "Normal", monthly: 7.99 },
  gold: { label: "Gold", monthly: 11.99 },
  platine: { label: "Platine", monthly: 19.99 },
  family: { label: "Family", monthly: 29 },
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

  // pack famille : éligible si >=2 items (mock simple)
  const familyDiscountEligible = items.length >= 2;
  const familyDiscountActive = familyDiscountEligible && plan !== "family";

  const baseMonthly = PLAN_META[plan].monthly;

  const upsellMonthly = useMemo(() => {
    let t = 0;
    for (const u of UPSELLS) {
      if (!selectedUpsells[u.key]) continue;
      if (u.key === "parents" && owned.parentsOwned) continue;
      t += u.monthly;
    }
    return t;
  }, [selectedUpsells, owned.parentsOwned]);

  const totalMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    if (familyDiscountActive) t = t * 0.8;
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, annualDiscountRate, familyDiscountActive]);

  const addItem = () => {
    const id = `i${Math.random().toString(16).slice(2)}`;
    setItems((p) => [...p, { id, level: "5e", subject: "Maths" }]);
  };
  const removeItem = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const updateItem = (id: string, patch: Partial<CartItem>) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const toggleUpsell = (k: UpsellKey) => {
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

    params.set("theme", themePack);
    params.set("skin", skin);

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
                  <div className="text-lg font-semibold">{money(totalMonthly)}</div>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-600">
                  ✅ Accès immédiat • ✅ Résiliation simple • ✅ Support rapide
                </div>
              </div>

              <button
                onClick={checkout}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Continuer → Confirmation
              </button>

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
