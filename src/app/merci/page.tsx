"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type SubState = {
  status: "active" | "canceled";
  plan: "Normal" | "Gold" | "Platine";
  period: "Mensuel" | "Annuel";
  trialDays: number;
  startedAt: string; // ISO
};

export default function MerciPage() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id") ?? "—";
  const plan = (sp.get("plan") as SubState["plan"]) || "Normal";
  const period = (sp.get("period") as SubState["period"]) || "Mensuel";
  const trialDays = Number(sp.get("trialDays") || "3");

  useEffect(() => {
    const key = "subscription:mock";
    const existing = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!existing) {
      const now = new Date().toISOString();
      const sub: SubState = { status: "active", plan, period, trialDays, startedAt: now };
      localStorage.setItem(key, JSON.stringify(sub));
    }
  }, [plan, period, trialDays]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Merci 🎉</h1>
      <p className="text-muted-foreground mt-1">Votre abonnement est en cours d’activation.</p>

      <div className="mt-6 rounded-2xl border p-4 bg-white space-y-2">
        <div><span className="font-semibold">Session :</span> {sessionId}</div>
        <div><span className="font-semibold">Plan :</span> {plan}</div>
        <div><span className="font-semibold">Période :</span> {period}</div>
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          ✅ Essai gratuit de <strong>{trialDays} jours</strong> activé. Vous pouvez annuler avant la fin de l’essai.
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <a href="/abonnement" className="inline-flex items-center rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-semibold">
          Gérer mon abonnement
        </a>
        <a href="/mon-compte/achats" className="inline-flex items-center rounded-xl px-4 py-2 bg-white border hover:bg-slate-50">
          Voir mes achats
        </a>
      </div>

      <p className="text-[12px] text-muted-foreground mt-6">
        En annuel (−20 %), l’engagement est de 12 mois. Les remises “Pack Famille” et “Méga pack −30 %”
        s’appliquent selon les conditions affichées dans votre panier.
      </p>
    </div>
  );
}
