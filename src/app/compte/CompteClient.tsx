"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AccountTabPinGuard } from "@/components/parent-pin/AccountTabPinGuard";
import { useRouter, useSearchParams } from "next/navigation";
import CompteProgressionTab from "@/components/compte/CompteProgressionTab";
import ParentsDashboardV2 from "@/components/compte/ParentsDashboardV2";
type SimpleUser = { id: string; email?: string | null; name?: string | null } | null;
type TabId = "progression" | "abonnement" | "badges" | "parents";
const TABS: { id: TabId; label: string }[] = [
  { id: "progression", label: "Ma progression" },
  { id: "abonnement", label: "Mon abonnement" },
  { id: "badges", label: "Badges" },
  { id: "parents", label: "Parents" },
];
type AccessStatus =
  | { kind: "GUEST" }
  | { kind: "PAYWALL" }
  | { kind: "EXPIRED"; endedAt?: string; lastPlan?: string }
  | { kind: "TRIAL"; grade?: string; subject?: string; endsAt?: string }
  | { kind: "FULL"; plan?: string; grades?: string[]; subjects?: string[]; endsAt?: string };
type BillingSubscription = {
  id: string;
  userId: string;
  plan: string;
  grade: string;
  subjectsJson: string;
  status: string;
  stripeSubscriptionId: string;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
};
export default function CompteClient({ user }: { user: SimpleUser }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialTab = (params.get("tab") as TabId) || "progression";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [access, setAccess] = useState<AccessStatus | null>(null);
  const [subscription, setSubscription] = useState<BillingSubscription | null>(null);
  useEffect(() => {
    const q = (params.get("tab") || "") as TabId | "";
    const next: TabId = q === "abonnement" || q === "parents" || q === "badges" || q === "progression" ? q : "progression";
    if (next !== tab) setTab(next);
  }, [params, tab]);
  useEffect(() => {
    let mounted = true;
    fetch("/api/access/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setAccess(j?.access ?? null);
      })
      .catch(() => {});
    fetch("/api/billing/subscription", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setSubscription(j?.subscription ?? null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  // Pour l'instant, un seul élève, mais l'UI est prête pour plusieurs.
  const students = [
    {
      id: "eleve-1",
      label: user?.name || user?.email || "Moi",
    },
  ];
  const [studentId, setStudentId] = useState<string>(students[0]?.id ?? "eleve-1");
  const currentStudent = students.find((s) => s.id === studentId) ?? students[0];
  const hasParentPremium = access?.kind === "FULL"; // vrai (plus de stub)
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <AccountTabPinGuard />
      <header className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Connecté en tant que <span className="font-medium">{user?.email ?? "utilisateur"}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">Mon compte</h1>
        <AccountAccessBanner access={access} subscription={subscription} />
      </header>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Onglets */}
        <nav className="inline-flex rounded-full bg-muted p-1 text-xs sm:text-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => router.push(`/compte?tab=${t.id}`)}
              className={[
                "px-3 sm:px-4 py-1.5 rounded-full transition",
                tab === t.id ? "bg-white shadow-sm text-black" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {/* Sélecteur d'élève (mode famille prêt) */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">Élève :</span>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="rounded-full border px-3 py-1 text-xs sm:text-sm bg-white"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Contenu d'onglet */}
      <section className="rounded-2xl border bg-white p-4 sm:p-6">
        {tab === "progression" && <CompteProgressionTab access={access} /> }
        {tab === "badges" && <TabBadges access={access} />}
                {tab === "parents" && <ParentsDashboardV2 /> }
</section>
    </main>
  );
}
function AccountAccessBanner({ access, subscription }: { access: AccessStatus | null; subscription: BillingSubscription | null }) {
  if (!access) return null;
  if (access.kind === "FULL") {
    const ends = access.endsAt ? new Date(access.endsAt).toLocaleDateString("fr-FR") : "—";
    const subjects = (access.subjects || []).join(", ") || "—";
    const grades = (access.grades || []).join(", ") || "—";
    return (
      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
        <div className="font-semibold text-emerald-900">✅ Abonnement actif</div>
        <div className="text-emerald-900/80">
          {access.plan || subscription?.plan || "—"} • Niveaux: {grades} • Matières: {subjects} • Fin: {ends}
        </div>
      </div>
    );
  }
  if (access.kind === "TRIAL") {
    const ends = access.endsAt ? new Date(access.endsAt).toLocaleString("fr-FR") : "—";
    return (
      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
        <div className="font-semibold text-blue-900">⏳ Essai en cours</div>
        <div className="text-blue-900/80">
          {access.grade || "—"} • {access.subject || "—"} • Fin: {ends}
        </div>
      </div>
    );
  }
  if (access.kind === "EXPIRED") {
    const ends = access.endedAt ? new Date(access.endedAt).toLocaleString("fr-FR") : "—";
    return (
      <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm">
        <div className="font-semibold text-rose-900">⛔ Abonnement expiré</div>
        <div className="text-rose-900/80">Fin: {ends}</div>
      </div>
    );
  }
  if (access.kind === "PAYWALL") {
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <div className="font-semibold">🔒 Accès bloqué</div>
        <div className="text-muted-foreground">Choisis une formule pour accéder aux contenus.</div>
      </div>
    );
  }
  return null;
}
/* -------------------- Onglet : Ma progression (V1 réel) -------------------- */
/* -------------------- Onglet : Badges (V1 réel) -------------------- */
function TabBadges({ access }: { access: AccessStatus | null }) {
  if (!access || access.kind === "GUEST") return <p className="text-sm text-muted-foreground">Connecte-toi pour voir tes badges.</p>;
  if (access.kind !== "FULL" && access.kind !== "TRIAL") {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <p className="text-sm text-muted-foreground">Les badges sont visibles avec un abonnement actif (ou un essai).</p>
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
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Badges</h2>
      <p className="text-sm text-muted-foreground">
      </p>
      <div className="rounded-xl border p-4">
        <div className="text-xs text-muted-foreground">État</div>
        <div className="mt-1 font-semibold">{access.kind === "FULL" ? "Abonnement actif" : "Essai actif"}</div>
      </div>
    </div>
  );
}
/* -------------------- Onglet : Parents (V1 réel) -------------------- */
/* -------------------- Onglet : Mon abonnement (déjà branché) -------------------- */
function TabAbonnement() {
  const [sub, setSub] = React.useState<any>(null);
  React.useEffect(() => {
    fetch("/api/billing/subscription", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setSub(j.subscription))
      .catch(() => {});
  }, []);
  if (!sub) {
    return <p className="text-sm text-muted-foreground">Aucun abonnement actif.</p>;
  }
  const subjects = (() => {
    try {
      return JSON.parse(sub.subjectsJson || "{}").subjects;
    } catch {
      return "";
    }
  })();
  const expired = new Date(sub.currentPeriodEnd) < new Date();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Mon abonnement</h2>
        <p className="text-sm text-muted-foreground">Données réelles synchronisées avec Stripe.</p>
      </div>
      <div className="rounded-xl border p-4 space-y-2">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold">
              Offre {sub.plan} — {sub.grade}
            </p>
            <p className="text-xs text-muted-foreground">{subjects}</p>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              expired ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {expired ? "Expiré" : "Actif"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Fin : {new Date(sub.currentPeriodEnd).toLocaleDateString("fr-FR")}
        </p>
        <div className="pt-3 flex gap-2">
          <a href="/panier" className="rounded-lg border px-3 py-1.5 text-xs hover:bg-accent">
            Modifier
          </a>
          {expired && (
            <a href="/tarifs" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700">
              Renouveler
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
