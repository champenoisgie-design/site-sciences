"use client";

import { useEffect, useMemo, useState } from "react";

type SubjectRow = {
  grade: string;
  subject: string;
  progressPercent: number;
  chaptersDone: number;
  chaptersTotal: number;
  timeMinutes: number;
  recommended: { title: string; reason: string; ctaDisabled: boolean };
  alerts: string[];
  chapters: Array<{ id: string; title: string; timeMinutes: number; done: boolean }>;
};

type Summary = {
  ok: boolean;
  kind: string;
  lastActiveAt: string | null;
  inactivityDays: number | null;
  globalAlerts: string[];
  perSubject: SubjectRow[];
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR");
  } catch {
    return "—";
  }
}

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function ProgressBar({ value }: { value: number }) {
  const v = clamp(value);
  return (
    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${v}%` }} />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="mt-1 text-3xl font-bold">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Pill({ children, tone }: { children: any; tone: "ok" | "warn" | "info" }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-900 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

function Goal({ title, value, max, unit }: { title: string; value: number; max: number; unit: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {value} / {max} {unit}
          </div>
        </div>
        <div className="text-xs font-semibold">{pct}%</div>
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {pct === 0 ? "Ton point de départ. Un petit pas suffit 👍" : "Continue comme ça 🚀"}
      </div>
    </div>
  );
}

export default function ProgressDashboardV2() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/progression/summary", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setSummary(j);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const primary = useMemo(() => summary?.perSubject?.[0] ?? null, [summary?.perSubject]);

  const global = useMemo(() => {
    const progress = primary?.progressPercent ?? 0;
    const chaptersDone = primary?.chaptersDone ?? 0;
    const chaptersTotal = primary?.chaptersTotal ?? 0;
    const time = primary?.timeMinutes ?? 0;
    return { progress, chaptersDone, chaptersTotal, time };
  }, [primary]);

  const emptyState = useMemo(() => {
    // A “motivating” empty state even at 0
    const isZero = (global.chaptersDone ?? 0) === 0 && (global.time ?? 0) === 0;
    return { isZero };
  }, [global.chaptersDone, global.time]);

  if (loading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
  if (!summary?.ok) return <p className="text-sm text-muted-foreground">Impossible de charger la progression.</p>;

  if (!primary) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Ma progression</h2>
        <p className="text-sm text-muted-foreground">Aucune matière active détectée.</p>
        <div className="flex gap-2">
          <a href="/tarifs" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Voir les tarifs
          </a>
          <a href="/panier" className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-accent">
            Aller au panier
          </a>
        </div>
      </div>
    );
  }

  const hasAnyAlert = (summary.globalAlerts?.length ?? 0) > 0 || (primary.alerts?.length ?? 0) > 0;
  const activityTone: "ok" | "warn" | "info" =
    summary.inactivityDays && summary.inactivityDays >= 7 ? "warn" : summary.lastActiveAt ? "ok" : "info";

  return (
    <div className="space-y-8">
      {/* Top header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Ma progression</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {primary.subject} — {primary.grade}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={activityTone}>
              Dernière activité : {summary.lastActiveAt ? fmtDate(summary.lastActiveAt) : "—"}
            </Pill>
            {summary.kind === "FULL" ? <Pill tone="ok">Accès actif</Pill> : summary.kind === "TRIAL" ? <Pill tone="info">Essai</Pill> : <Pill tone="warn">Accès limité</Pill>}
          </div>
        </div>

        {/* Big motivating banner */}
        {emptyState.isZero ? (
          <div className="rounded-2xl border bg-emerald-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-emerald-800">POINT DE DÉPART</div>
                <div className="mt-1 text-lg font-semibold">Ton parcours commence maintenant 🌱</div>
                <div className="mt-1 text-sm text-emerald-900/80">
                  Commence par un chapitre simple. En 10 minutes tu peux déjà débloquer ton premier badge.
                </div>
              </div>
              <div className="flex gap-2">
                <a href="/panier?tab=subjects" className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-emerald-100">
                  Ajouter une matière
                </a>
                <button disabled className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white opacity-60">
                  Commencer un chapitre
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Alerts section (always shows) */}
        <div className={`rounded-2xl border p-4 ${hasAnyAlert ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{hasAnyAlert ? "Alertes" : "État"}</div>
            {!hasAnyAlert ? <span className="text-xs font-semibold text-emerald-700">Tout est OK ✅</span> : null}
          </div>
          {hasAnyAlert ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
              {(summary.globalAlerts || []).map((a, i) => <li key={`g-${i}`}>{a}</li>)}
              {(primary.alerts || []).map((a, i) => <li key={`p-${i}`}>{a}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun problème détecté. Continue à ton rythme, même 5 minutes par jour font la différence.
            </p>
          )}
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Progression globale" value={`${global.progress} %`} subtitle="Basée sur chapitres complétés" icon="📈" />
        <StatCard title="Chapitres" value={`${global.chaptersDone} / ${global.chaptersTotal}`} subtitle="Complétés / disponibles" icon="📚" />
        <StatCard title="Temps total" value={`${global.time} min`} subtitle="Temps d’apprentissage cumulé" icon="⏱️" />
      </div>

      {/* Visual progress bar */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Progression globale</div>
          <div className="text-sm font-semibold">{global.progress}%</div>
        </div>
        <div className="mt-3"><ProgressBar value={global.progress} /></div>
        <div className="mt-2 text-xs text-muted-foreground">
          {global.progress === 0 ? "Objectif : terminer 1 chapitre cette semaine." : "Objectif : garder ton rythme cette semaine."}
        </div>
      </div>

      {/* Per-subject list */}
      <div className="rounded-2xl border bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Progression par matière</h3>
          <a href="/panier" className="text-xs font-semibold underline underline-offset-2">
            Gérer mes matières
          </a>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {summary.perSubject.map((row) => (
            <div key={`${row.grade}:${row.subject}`} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{row.subject}</div>
                  <div className="text-xs text-muted-foreground">{row.grade}</div>
                </div>
                <div className="text-xs font-semibold">{row.progressPercent}%</div>
              </div>

              <div className="mt-3"><ProgressBar value={row.progressPercent} /></div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Chapitres: {row.chaptersDone}/{row.chaptersTotal}</span>
                <span>•</span>
                <span>Temps: {row.timeMinutes} min</span>
              </div>

              {row.alerts?.length ? (
                <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {row.alerts[0]}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation (premium card) */}
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              ⭐ À faire maintenant
            </div>
            <div className="mt-2 text-lg font-semibold">{primary.recommended.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{primary.recommended.reason}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Astuce : démarre par 10 minutes. Le plus dur, c’est de commencer.
            </div>
          </div>

          <div className="flex gap-2">
            <button disabled className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white opacity-60">
              Commencer
            </button>
            <a href="/panier" className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-accent">
              Modifier mon pack
            </a>
          </div>
        </div>
      </div>

      {/* Goals with gauges */}
      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold">Objectifs (semaine)</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Goal title="Chapitres terminés" value={global.chaptersDone} max={1} unit="" />
          <Goal title="Temps total" value={global.time} max={60} unit="min" />
          <Goal title="Jours actifs" value={0} max={7} unit="jours" />
        </div>
        <div className="text-xs text-muted-foreground">
          Les “jours actifs” seront calculés dès qu’on stocke l’activité quotidienne.
        </div>
      </div>

      {/* Time per chapter */}
      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold">Temps par chapitre</h3>
        <p className="text-sm text-muted-foreground">
          Cette liste se remplira automatiquement dès que le contenu (chapitres/exercices) est branché.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {primary.chapters.slice(0, 8).map((ch) => (
            <div key={ch.id} className="rounded-xl border p-3 flex items-center justify-between">
              <div className="text-sm font-medium">{ch.title}</div>
              <div className="text-xs text-muted-foreground">{ch.timeMinutes} min</div>
            </div>
          ))}
        </div>
      </div>

      {/* “Already implemented” roadmap */}
      <div className="rounded-2xl border border-dashed bg-white p-5">
        <h3 className="font-semibold">Ce qui est déjà en place</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• Statistiques détaillées par matière ✅</li>
          <li>• Temps passé par chapitre ✅ (structure + affichage)</li>
          <li>• Alertes en cas d’inactivité ✅</li>
          <li>• Recommandations personnalisées ✅</li>
        </ul>
      </div>
    </div>
  );
}
