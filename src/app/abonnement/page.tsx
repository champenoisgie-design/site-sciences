"use client";
import React, { useEffect, useMemo, useState } from "react";

type SubState = {
  status: "active" | "canceled";
  plan: "Normal" | "Gold" | "Platine";
  period: "Mensuel" | "Annuel";
  trialDays: number;
  startedAt: string; // ISO
};

function loadSub(): SubState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("subscription:mock");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSub(s: SubState) {
  localStorage.setItem("subscription:mock", JSON.stringify(s));
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AbonnementPage() {
  const [sub, setSub] = useState<SubState | null>(null);

  useEffect(() => {
    setSub(loadSub());
  }, []);

  const trialInfo = useMemo(() => {
    if (!sub) return null;
    const start = new Date(sub.startedAt);
    const now = new Date();
    const used = Math.max(0, daysBetween(start, now));
    const left = Math.max(0, sub.trialDays - used);
    return { used, left, total: sub.trialDays };
  }, [sub]);

  const toggleCancel = () => {
    if (!sub) return;
    const next: SubState = {
      ...sub,
      status: sub.status === "active" ? "canceled" : "active",
    };
    setSub(next);
    saveSub(next);
  };

  if (!sub) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">Mon abonnement</h1>
        <p className="text-muted-foreground mt-2">
          Aucun abonnement actif. Rendez-vous sur la page <a className="underline" href="/tarifs">Tarifs</a> pour souscrire.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-bold">Mon abonnement</h1>

      <div className="rounded-2xl border p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Statut</div>
            <div className="text-lg font-semibold">
              {sub.status === "active" ? "Actif" : "Annulé"}
            </div>
          </div>
          <button
            onClick={toggleCancel}
            className={`rounded-xl px-4 py-2 font-semibold ${
              sub.status === "active"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {sub.status === "active" ? "Annuler l’abonnement" : "Réactiver"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Plan</div>
            <div className="font-medium">{sub.plan}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Période</div>
            <div className="font-medium">{sub.period} {sub.period === "Annuel" ? "(−20%)" : ""}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Début</div>
            <div className="font-medium">{new Date(sub.startedAt).toLocaleDateString("fr-FR")}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Essai gratuit</div>
            <div className="font-medium">
              {trialInfo ? `${trialInfo.left} j restants / ${trialInfo.total} j` : "—"}
            </div>
          </div>
        </div>

        <p className="text-[12px] text-muted-foreground mt-3">
          En annuel (−20 %), l’engagement est de 12 mois. Vous pouvez annuler avant la fin de l’essai gratuit (3 jours).
        </p>
      </div>

      <div className="rounded-2xl border p-4 bg-white">
        <div className="text-sm font-semibold mb-1">Envie d’encore plus ?</div>
        <div className="text-sm text-muted-foreground">
          Passez en <strong>Gold</strong> pour les fiches personnalisées et le tableau Parents, ou en <strong>Platine</strong> pour Co-Pilot,
          Mentor, Simulations 3D et support prioritaire.
        </div>
        <div className="mt-3 flex gap-2">
          <a href="/panier?plan=Gold&period=Annuel" className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold">Choisir Gold</a>
          <a href="/panier?plan=Platine&period=Annuel" className="rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold">Passer Platine</a>
        </div>
      </div>
    </div>
  );
}
