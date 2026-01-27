"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "normal" | "gold" | "platine";
type Mode = "visitor" | "subscribed";
type Duration = "monthly" | "annual";
type CartItem = { id: string; level: string; subject: string };

type UpsellKey = "parents" | "coach" | "pdf" | "ia";
type ThemePack = "mario" | "onepiece";
type Skin = "neon" | "solaire" | "pastel";

type LearningMode = "normal" | "dys" | "challenge" | "expert";
type Pace = "calme" | "normal" | "intensif";

type Chapter = { id: string; title: string; level: string; subject: string; price: number };

const PLAN_META: Record<Plan, { label: string; monthly: number; perk: string }> = {
  gold: { label: "Gold", monthly: 14, perk: "Progression rapide" },
  platine: { label: "Platine", monthly: 24, perk: "Full unlock + suivi" },
  family: { label: "Family", monthly: 29, perk: "Multi-profils" },
};

const LEVELS = ["6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];
const SUBJECTS = ["Maths", "Physique-Chimie", "SVT", "Français", "Histoire-Géo"];

const UPSELLS: Array<{ key: UpsellKey; label: string; monthly: number }> = [
  { key: "parents", label: "Parents+", monthly: 6 },
  { key: "coach", label: "Coach", monthly: 9 },
  { key: "pdf", label: "PDF", monthly: 4 },
  { key: "ia", label: "IA", monthly: 5 },
];

const CHAPTERS: Chapter[] = [
  { id: "c1", title: "Fractions — Bases & simplifications", level: "5e", subject: "Maths", price: 4.9 },
  { id: "c2", title: "Proportionnalité — Méthodes", level: "4e", subject: "Maths", price: 4.9 },
  { id: "c3", title: "Électricité — Lois & circuits", level: "4e", subject: "Physique-Chimie", price: 5.9 },
  { id: "c4", title: "Réactions — Équations", level: "3e", subject: "Physique-Chimie", price: 5.9 },
  { id: "c5", title: "Génétique — Notions clés", level: "3e", subject: "SVT", price: 4.9 },
  { id: "c6", title: "Grammaire — Fonctions", level: "4e", subject: "Français", price: 3.9 },
];

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}
function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}
function readPlan(p: string | null): Plan {
  if (p === "gold" || p === "platine" || p === "family") return p;
  return "gold";
}
function readMode(m: string | null): Mode {
  if (m === "visitor" || m === "subscribed") return m;
  return "visitor";
}

function ProgressBar() {
  const steps = [
    { label: "Tarifs", done: true },
    { label: "Paiement", done: true, current: true },
    { label: "Confirmation", done: false },
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
        {steps.map((s, idx) => (
          <div key={s.label} className="flex flex-1 items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                ('current' in s && (s as any).current)
                  ? "border-white bg-white text-slate-900"
                  : s.done
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                    : "border-slate-700 bg-slate-950/30 text-slate-300"
              )}
            >
              {idx + 1}
            </div>
            <div className={cn("font-semibold", ('current' in s && (s as any).current) ? "text-white" : "text-slate-200")}>{s.label}</div>

            {idx < steps.length - 1 ? (
              <div className="mx-2 h-[2px] flex-1 rounded-full bg-slate-800">
                <div className={cn("h-full rounded-full", steps[idx].done ? "w-full bg-emerald-500/60" : "w-0 bg-slate-700")} />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-slate-400">Étape 2/3 — Paiement (mock)</div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-slate-200">Objectif : finaliser en 30s ✨</div>
      </div>
    </div>
  );
}

export default function PreviewPanier3() {
  const sp = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState<"subjects" | "themes" | "learning" | "chapters">("subjects");

  const [plan, setPlan] = useState<Plan>(readPlan(sp.get("plan")));
  const [mode, setMode] = useState<Mode>(readMode(sp.get("mode")));
  const [duration, setDuration] = useState<Duration>("annual");

  const [items, setItems] = useState<CartItem[]>([{ id: "i1", level: "4e", subject: "Physique-Chimie" }]);

  const [selectedUpsells, setSelectedUpsells] = useState<Record<UpsellKey, boolean>>({
    parents: false,
    coach: false,
    pdf: false,
    ia: false,
  });

  const [themePack, setThemePack] = useState<ThemePack>("mario");
  const [skin, setSkin] = useState<Skin>("neon");

  // Learning
  const [learningMode, setLearningMode] = useState<LearningMode>("normal");
  const [pace, setPace] = useState<Pace>("normal");
  const [audioAid, setAudioAid] = useState<boolean>(true);

  // Chapters
  const [selectedChapters, setSelectedChapters] = useState<Record<string, boolean>>({
    c1: true,
    c3: true,
  });

  // Ownership mock
  const owned = useMemo(() => {
    const isSub = mode === "subscribed";
    const parentsOwned = isSub && (plan === "platine" || plan === "family");
    const themeOwned: Partial<Record<ThemePack, boolean>> = isSub ? { onepiece: true } : {};
    const skinOwned: Partial<Record<Skin, boolean>> = isSub ? { solaire: true } : {};
    return { parentsOwned, themeOwned, skinOwned };
  }, [mode, plan]);

  // Keep URL synced
  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("plan", plan);
    params.set("mode", mode);
    router.replace(`/preview/previewpanier3?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, mode]);

  // Parents owned => checked
  useEffect(() => {
    if (owned.parentsOwned) setSelectedUpsells((p) => ({ ...p, parents: true }));
  }, [owned.parentsOwned]);

  const annual = duration === "annual";
  const familyEligible = items.length >= 2;

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
    if (annual) t = t * 0.8;
    if (familyEligible && plan !== "family") t = t * 0.8;
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, annual, familyEligible, plan]);

  const chaptersTotal = useMemo(() => {
    let t = 0;
    for (const ch of CHAPTERS) if (selectedChapters[ch.id]) t += ch.price;
    return Math.round(t * 100) / 100;
  }, [selectedChapters]);

  const xp = useMemo(() => {
    let v = plan === "gold" ? 120 : plan === "platine" ? 180 : 220;
    v += items.length * 15;

    for (const u of UPSELLS) {
      if (!selectedUpsells[u.key]) continue;
      if (u.key === "parents" && owned.parentsOwned) continue;
      v += 25;
    }

    if (learningMode === "dys") v += 15;
    if (learningMode === "challenge") v += 30;
    if (learningMode === "expert") v += 25;
    if (pace === "intensif") v += 20;

    v += Object.values(selectedChapters).filter(Boolean).length * 8;

    if (annual) v += 40;
    if (familyEligible) v += 40;
    return v;
  }, [plan, items.length, selectedUpsells, owned.parentsOwned, annual, familyEligible, learningMode, pace, selectedChapters]);

  const addItem = () => setItems((p) => [...p, { id: `i${Date.now()}`, level: "5e", subject: "Maths" }]);
  const removeItem = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const updateItem = (id: string, patch: Partial<CartItem>) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const toggleUpsell = (k: UpsellKey) => {
    if (k === "parents" && owned.parentsOwned) return;
    setSelectedUpsells((p) => ({ ...p, [k]: !p[k] }));
  };

  const toggleChapter = (id: string) => setSelectedChapters((p) => ({ ...p, [id]: !p[id] }));

  const checkout = () => {
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("mode", mode);
    params.set("duration", duration);

    params.set("items", items.map((i) => `${i.level}:${i.subject}`).join("|"));

    const ups = Object.entries(selectedUpsells).filter(([, v]) => v).map(([k]) => k).join(",");
    if (ups) params.set("upsells", ups);

    params.set("theme", themePack);
    params.set("skin", skin);

    params.set("learning", learningMode);
    params.set("pace", pace);
    params.set("audio", audioAid ? "1" : "0");

    const ch = Object.entries(selectedChapters).filter(([, v]) => v).map(([k]) => k).join(",");
    if (ch) params.set("chapters", ch);
    params.set("chapters_total", String(chaptersTotal));

    params.set("source", "previewpanier3");

    router.push(`/preview/panier/confirmation?${params.toString()}`);
  };

  const SubjectsTab = (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">Formule</div>
          <select className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm" value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
            <option value="gold">Gold</option>
            <option value="platine">Platine</option>
            <option value="family">Family</option>
          </select>
          <div className="mt-2 text-xs text-slate-400">{PLAN_META[plan].perk}</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">Durée</div>
          <select className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm" value={duration} onChange={(e) => setDuration(e.target.value as any)}>
            <option value="monthly">Mensuel</option>
            <option value="annual">Annuel (-20%)</option>
          </select>
          <div className="mt-2 text-xs text-slate-400">{annual ? "Carte annuel active" : "Standard"}</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
          <div className="text-xs text-slate-400">Total mensuel</div>
          <div className="mt-2 text-2xl font-semibold">{money(totalMonthly)}</div>
          <div className="mt-1 text-xs text-slate-400">estimation</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950/30 p-4 md:flex-row md:items-center">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <select className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm md:w-36" value={it.level} onChange={(e) => updateItem(it.id, { level: e.target.value })}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm" value={it.subject} onChange={(e) => updateItem(it.id, { subject: e.target.value })}>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <button onClick={() => removeItem(it.id)} className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm hover:border-slate-600">
              Retirer
            </button>
          </div>
        ))}
      </div>

      <button onClick={addItem} className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm hover:border-slate-600">
        + Ajouter une matière/niveau
      </button>
    </section>
  );

  const ThemesTab = (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-lg font-semibold">Thèmes visuels (démo)</div>
          <div className="mt-1 text-sm text-slate-300">Pack thème + skin UI. “Déjà acheté” = disabled.</div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Impact: motivation</div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
          <div className="text-sm font-semibold">Pack thème</div>
          <div className="mt-3 grid gap-2">
            {(["mario", "onepiece"] as ThemePack[]).map((t) => {
              const isOwned = !!owned.themeOwned[t];
              const active = themePack === t;
              // on laisse sélectionnable (même si déjà acheté) car c'est "pack visuel inclus" dans l'abonnement,
              // mais on le badge comme "déjà acheté".
              return (
                <button
                  key={t}
                  onClick={() => setThemePack(t)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    active ? "border-white/60 bg-white/10" : "border-slate-800 bg-slate-950/40 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{t === "mario" ? "Mario" : "One Piece"}</div>
                      <div className="mt-1 text-xs text-slate-400">Univers + micro-interactions (mock)</div>
                    </div>
                    {isOwned ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-200">Déjà acheté</span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">Inclus</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
          <div className="text-sm font-semibold">Skin UI</div>
          <div className="mt-3 grid gap-2">
            {(["neon", "solaire", "pastel"] as Skin[]).map((s) => {
              const isOwned = !!owned.skinOwned[s];
              const active = skin === s;
              const disabled = isOwned;
              return (
                <button
                  key={s}
                  onClick={() => {
                    if (disabled) return;
                    setSkin(s);
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    disabled
                      ? "border-emerald-500/40 bg-emerald-500/10 opacity-90"
                      : active
                        ? "border-white/60 bg-white/10"
                        : "border-slate-800 bg-slate-950/40 hover:border-slate-600"
                  )}
                  aria-disabled={disabled}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{s === "neon" ? "Neon" : s === "solaire" ? "Solaire" : "Pastel"}</div>
                      <div className="mt-1 text-xs text-slate-400">Palette UI + contrastes (mock)</div>
                    </div>
                    {isOwned ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-200">Déjà acheté</span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">{active ? "Actif" : "Choisir"}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const LearningTab = (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-lg font-semibold">Modes d’apprentissage</div>
          <div className="mt-1 text-sm text-slate-300">Personnalise l’affichage, l’aide et le rythme.</div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Impact: completion</div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          { id: "normal", label: "Normal", desc: "Explications standard" },
          { id: "dys", label: "DYS", desc: "Phrases courtes + repères" },
          { id: "challenge", label: "Challenge", desc: "Moins d’indices, + défis" },
          { id: "expert", label: "Expert", desc: "Synthèse + exercices durs" },
        ].map((m) => {
          const active = learningMode === (m.id as LearningMode);
          return (
            <button
              key={m.id}
              onClick={() => setLearningMode(m.id as LearningMode)}
              className={cn("rounded-3xl border p-4 text-left transition", active ? "border-white/60 bg-white/10" : "border-slate-800 bg-slate-950/30 hover:border-slate-600")}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{m.label}</div>
                {active ? <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">Actif</span> : null}
              </div>
              <div className="mt-1 text-xs text-slate-400">{m.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
          <div className="text-sm font-semibold">Rythme</div>
          <div className="mt-3 grid gap-2">
            {[
              { id: "calme", label: "Calme", desc: "plus de pas-à-pas" },
              { id: "normal", label: "Normal", desc: "équilibré" },
              { id: "intensif", label: "Intensif", desc: "plus d’exos, moins de texte" },
            ].map((p) => {
              const active = pace === (p.id as Pace);
              return (
                <button
                  key={p.id}
                  onClick={() => setPace(p.id as Pace)}
                  className={cn("rounded-2xl border p-4 text-left transition", active ? "border-white/60 bg-white/10" : "border-slate-800 bg-slate-950/40 hover:border-slate-600")}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{p.label}</div>
                    <div className="text-xs text-slate-400">{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
          <div className="text-sm font-semibold">Aides</div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
            <div>
              <div className="font-semibold">Audio / Lecture</div>
              <div className="mt-1 text-xs text-slate-400">Lecture des consignes (mock)</div>
            </div>
            <button
              onClick={() => setAudioAid((v) => !v)}
              className={cn("rounded-full px-3 py-2 text-xs font-semibold transition", audioAid ? "bg-white text-slate-900" : "bg-slate-800 text-slate-200 hover:bg-slate-700")}
            >
              {audioAid ? "Activée" : "Désactivée"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const ChaptersTab = (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-lg font-semibold">Achat par chapitre</div>
          <div className="mt-1 text-sm text-slate-300">Alternative à l’abonnement : achat unique.</div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Achat unique: {money(chaptersTotal)}</div>
      </div>

      <div className="mt-5 grid gap-3">
        {CHAPTERS.map((ch) => {
          const checked = !!selectedChapters[ch.id];
          return (
            <button
              key={ch.id}
              onClick={() => toggleChapter(ch.id)}
              className={cn("rounded-3xl border p-4 text-left transition", checked ? "border-white/60 bg-white/10" : "border-slate-800 bg-slate-950/30 hover:border-slate-600")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn("mt-1 h-5 w-5 rounded-md border", checked ? "border-white bg-white" : "border-slate-600")}>
                    {checked ? <div className="h-full w-full rounded-md bg-slate-950" /> : null}
                  </div>
                  <div>
                    <div className="font-semibold">{ch.title}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {ch.level} • {ch.subject} • Accès immédiat (mock)
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-200">{money(ch.price)}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-300">
            <div className="font-semibold text-slate-100">Résumé Chapitres</div>
            <div className="mt-1 text-xs text-slate-400">
              {Object.values(selectedChapters).filter(Boolean).length} chapitre(s) • Achat unique (hors abonnement)
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Achat unique</div>
            <div className="mt-1 text-2xl font-semibold">{money(chaptersTotal)}</div>
          </div>
        </div>
      </div>
    </section>
  );

  const TabContent =
    tab === "subjects" ? SubjectsTab : tab === "themes" ? ThemesTab : tab === "learning" ? LearningTab : ChaptersTab;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ProgressBar />

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-slate-400">PREVIEW — Panier (variante 3)</div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">🧺 Mon panier — Unlock</h1>
              <p className="mt-2 text-slate-300">Tunnel conversion: onglets complets + progression.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs text-slate-400">Mode</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setMode("visitor")} className={cn("rounded-xl px-3 py-2 text-sm", mode === "visitor" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-200 hover:bg-slate-700")}>
                    Visiteur
                  </button>
                  <button onClick={() => setMode("subscribed")} className={cn("rounded-xl px-3 py-2 text-sm", mode === "subscribed" ? "bg-white text-slate-900" : "bg-slate-800 text-slate-200 hover:bg-slate-700")}>
                    Abonné
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs text-slate-400">XP</div>
                <div className="mt-2 text-xl font-semibold">{xp} XP</div>
                <div className="mt-1 text-xs text-slate-400">Boost selon choix</div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/30 p-2">
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
                  className={cn("rounded-xl px-3 py-2 text-sm", tab === t.k ? "bg-white text-slate-900" : "bg-slate-950/40 text-slate-200 hover:bg-slate-800")}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {TabContent}

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Options</div>
                <div className="text-xs text-slate-400">{owned.parentsOwned ? "Parents+ déjà acheté" : "Upsell possible"}</div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {UPSELLS.map((u) => {
                  const isOwned = u.key === "parents" && owned.parentsOwned;
                  const checked = !!selectedUpsells[u.key];
                  return (
                    <button
                      key={u.key}
                      onClick={() => toggleUpsell(u.key)}
                      className={cn(
                        "rounded-3xl border p-4 text-left transition",
                        isOwned ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800 bg-slate-950/30 hover:border-slate-600"
                      )}
                      aria-disabled={isOwned}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{u.label}</div>
                            {isOwned ? (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-200">Déjà acheté</span>
                            ) : checked ? (
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">Équipé</span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">+{u.monthly}€/mois (mock)</div>
                        </div>
                        <div className={cn("text-sm", isOwned ? "text-emerald-200" : "text-slate-200")}>
                          {isOwned ? "Inclus" : `+${money(u.monthly)}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="text-sm text-slate-300">
                  <div className="text-xs text-slate-400">Plan : <span className="text-slate-200">{PLAN_META[plan].label}</span></div>
                  <div className="mt-1 text-xs text-slate-400">Durée : <span className="text-slate-200">{annual ? "Annuel" : "Mensuel"}</span></div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {annual ? <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">Annuel -20%</span> : null}
                    {familyEligible && plan !== "family" ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Pack Famille -20%</span> : null}
                    {chaptersTotal > 0 ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Chapitres: {money(chaptersTotal)} (unique)</span> : null}
                  </div>

                  {!familyEligible ? (
                    <div className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300">
                      Encore 1 niveau pour débloquer le Pack Famille -20%.
                    </div>
                  ) : null}
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total mensuel</div>
                  <div className="mt-1 text-3xl font-semibold">{money(totalMonthly)}</div>
                  <button onClick={checkout} className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                    Continuer → Confirmation
                  </button>
                  {chaptersTotal > 0 ? <div className="mt-2 text-xs text-slate-400">+ {money(chaptersTotal)} achat unique (chapitres)</div> : null}
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="text-sm font-semibold">Récap rapide</div>
              <div className="mt-3 text-sm text-slate-300">
                {items.length} sélection(s) • {annual ? "Annuel" : "Mensuel"} • {learningMode.toUpperCase()}
              </div>

              <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{PLAN_META[plan].label}</div>
                    <div className="mt-1 text-xs text-slate-400">{PLAN_META[plan].perk}</div>
                    <div className="mt-2 text-xs text-slate-400">Thème {themePack} • Skin {skin}</div>
                    <div className="mt-1 text-xs text-slate-400">Rythme {pace} • Audio {audioAid ? "on" : "off"}</div>
                    <div className="mt-1 text-xs text-slate-400">Chapitres: {Object.values(selectedChapters).filter(Boolean).length}</div>
                  </div>
                  <div className="text-sm text-slate-200">{money(totalMonthly)}/mois</div>
                </div>

                <div className="mt-3 border-t border-slate-800 pt-3 text-xs text-slate-300">
                  ✅ Accès immédiat • ✅ Résiliation simple • ✅ Paramètres sauvegardés (mock)
                </div>

                {chaptersTotal > 0 ? (
                  <div className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-200">
                    Achat unique chapitres : <span className="font-semibold">{money(chaptersTotal)}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-center text-xs text-slate-300 hover:border-slate-600" href={`/preview/tarifs?mode=${mode}`}>
                  Tarifs
                </a>
                <a className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-center text-xs text-slate-300 hover:border-slate-600" href={`/preview/panier?plan=${plan}&mode=${mode}`}>
                  Panier ref
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <a className="hover:text-white" href={`/preview/tarifs?mode=${mode}`}>← Retour Tarifs</a>
          <a className="hover:text-white" href="/preview/accueil">Accueil Preview</a>
        </div>
      </div>
    </div>
  );
}
