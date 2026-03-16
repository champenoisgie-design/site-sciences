"use client";

import { useEffect, useMemo, useState } from "react";

type Summary = {
  ok: boolean;
  kind: string;
  lastActiveAt: string | null;
  inactivityDays: number | null;
  endsAt: string | null;
  globalAlerts: string[];
  scope: Array<{ grade: string; subject: string }>;
  subjectAlerts: Array<{ grade: string; subject: string; alerts: string[] }>;
  metrics: {
    weeklyMinutes: number;
    weeklySessions: number;
    streakDays: number;
    chaptersDoneThisWeek: number;
  };
  recommendations: Array<{ title: string; detail: string; cta: { label: string; href: string; disabled?: boolean } }>;
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

function Pill({ children, tone }: { children: any; tone: "ok" | "warn" | "info" }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-900 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
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

function Goal({ title, value, max, unit, hint }: { title: string; value: number; max: number; unit: string; hint: string }) {
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
      <div className="mt-3"><ProgressBar value={pct} /></div>
      <div className="mt-2 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

export default function ParentsDashboardV2() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/parents/summary", { cache: "no-store" })
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

  const scopeLabel = useMemo(() => {
    const s = summary?.scope ?? [];
    if (!s.length) return "—";
    // Example: "4e • Physique-Chimie (+1 ...)"
    const first = s[0];
    const extra = s.length > 1 ? ` (+${s.length - 1})` : "";
    return `${first.grade} • ${first.subject}${extra}`;
  }, [summary?.scope]);

  const activityTone: "ok" | "warn" | "info" = useMemo(() => {
    if (!summary?.lastActiveAt) return "info";
    if ((summary.inactivityDays ?? 0) >= 7) return "warn";
    return "ok";
  }, [summary?.lastActiveAt, summary?.inactivityDays]);

  const hasAlerts = (summary?.globalAlerts?.length ?? 0) > 0;

  if (loading) return <p className="text-sm text-muted-foreground">Chargement…</p>;
if (!summary?.ok) return <p className="text-sm text-muted-foreground">Impossible de charger l’espace Parents.</p>;

  if (summary.kind !== "FULL" && summary.kind !== "TRIAL") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Espace Parents</h2>
        <p className="text-sm text-muted-foreground">
          L’espace Parents est disponible avec un abonnement actif (ou un essai en cours).
        </p>
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

  const m = summary.metrics;

  return (
      <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Espace Parents</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Périmètre : <span className="font-medium">{scopeLabel}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={activityTone}>
              Dernière activité : {summary.lastActiveAt ? fmtDate(summary.lastActiveAt) : "—"}
            </Pill>
            {summary.endsAt ? <Pill tone="ok">Accès jusqu’au {new Date(summary.endsAt).toLocaleDateString("fr-FR")}</Pill> : null}
          </div>
        </div>

        {/* Status / alerts */}
        <div className={`rounded-2xl border p-4 ${hasAlerts ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{hasAlerts ? "Alertes Parents" : "État"}</div>
            {!hasAlerts ? <span className="text-xs font-semibold text-emerald-700">Tout est OK ✅</span> : null}
          </div>
          {hasAlerts ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
              {summary.globalAlerts.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun signal d’alerte. Continuez à viser la régularité (petites sessions fréquentes).
            </p>
          )}
        </div>
      </div>

      {/* KPI dashboard */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Temps (7 jours)" value={`${m.weeklyMinutes} min`} subtitle="Temps d’apprentissage total" icon="⏱️" />
        <StatCard title="Séances (7 jours)" value={`${m.weeklySessions}`} subtitle="Sessions détectées" icon="🗓️" />
        <StatCard title="Série" value={`${m.streakDays} j`} subtitle="Jours consécutifs actifs" icon="🔥" />
        <StatCard title="Chapitres" value={`${m.chaptersDoneThisWeek}`} subtitle="Terminés cette semaine" icon="📚" />
      </div>

      {/* Parent goals */}
      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <h3 className="font-semibold">Objectifs (Parents)</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Goal title="Régularité" value={m.weeklySessions} max={3} unit="séances" hint="Objectif : 3 petites séances / semaine." />
          <Goal title="Temps" value={m.weeklyMinutes} max={60} unit="min" hint="Objectif : 60 minutes cumulées / semaine." />
          <Goal title="Série" value={m.streakDays} max={7} unit="jours" hint="Objectif : une action par jour pendant 7 jours." />
        </div>
        <div className="text-xs text-muted-foreground">
          Ces indicateurs se rempliront automatiquement dès que les chapitres/exercices (Prisma) sont branchés.
        </div>
      </div>

      {/* Subject alerts */}
      <div className="rounded-2xl border bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Suivi par matière</h3>
          <a href="/compte?tab=progression" className="text-xs font-semibold underline underline-offset-2">
            Voir la progression élève
          </a>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {summary.subjectAlerts.map((row) => (
            <div key={`${row.grade}:${row.subject}`} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{row.subject}</div>
                  <div className="text-xs text-muted-foreground">{row.grade}</div>
                </div>
                <Pill tone={row.alerts?.length ? "warn" : "ok"}>{row.alerts?.length ? "À surveiller" : "OK"}</Pill>
              </div>

              {row.alerts?.length ? (
                <ul className="mt-3 list-disc pl-5 text-xs text-amber-900">
                  {row.alerts.slice(0, 2).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Aucune alerte.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold">Recommandations (action parents)</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {(summary.recommendations || []).map((r, i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="text-xs font-semibold text-emerald-700">SUGGESTION</div>
              <div className="mt-1 text-sm font-semibold">{r.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{r.detail}</div>
              <div className="mt-3">
                {r.cta.disabled ? (
                  <button disabled className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white opacity-60">
                    {r.cta.label}
                  </button>
                ) : (
                  <a href={r.cta.href} className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800">
                    {r.cta.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* “Already implemented now” roadmap */}
      <div className="rounded-2xl border border-dashed bg-white p-5">
        <h3 className="font-semibold">Ce qui est déjà en place</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• Alertes inactivité ✅ (DeviceSession.lastSeenAt)</li>
          <li>• Périmètre matières/niveaux ✅ (scope abonnement / essai)</li>
          <li>• Fin d’accès (abonnement) ✅</li>
          <li>• Recommandations “parents actionnables” ✅</li>
        </ul>
      </div>
    </div>
  );
}
