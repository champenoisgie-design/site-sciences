"use client";
import { useState } from "react";
export default function AbonnementPage() {
  const [loading, setLoading] = useState(false);
  const [mandate, setMandate] = useState<string | null>(null);

  async function startRedirect() {
    setLoading(true);
    const res = await fetch("/api/billing/gc/redirect/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const data = await res.json(); if (data?.redirect_url) window.location.href = data.redirect_url;
  }
  async function completeRedirect() {
    const rid = new URLSearchParams(window.location.search).get("redirect_flow_id");
    if (!rid) return alert("redirect_flow_id manquant");
    const res = await fetch("/api/billing/gc/redirect/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ redirect_flow_id: rid, session_token: "demo-token" }) });
    const data = await res.json(); setMandate(data?.mandate ?? null);
    alert("Mandat confirmé: " + data?.mandate);
  }
  async function createSubscription() {
    if (!mandate) return alert("Mandat requis");
    const res = await fetch("/api/billing/gc/subscription/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mandate_id: mandate, amount_cents: 999, interval_unit: "monthly", interval: 1, plan_name: "Mensuel 9,99€" }) });
    const data = await res.json(); alert("Abonnement créé: " + data?.id + " (" + data?.status + ")");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Abonnement — essai gratuit 3 jours (GoCardless)</h1>
      <ol className="list-decimal pl-6 space-y-3">
        <li>Démarrer ➜ page GoCardless (IBAN sandbox).</li>
        <li>Retour ici ➜ “Confirmer le mandat”.</li>
        <li>Créer l’abonnement ➜ prélèvement auto dans 3 jours.</li>
      </ol>
      <div className="flex gap-3">
        <button onClick={startRedirect} disabled={loading} className="bg-black text-white rounded px-4 py-2">Démarrer</button>
        <button onClick={completeRedirect} className="border rounded px-4 py-2">Confirmer le mandat</button>
        <button onClick={createSubscription} className="border rounded px-4 py-2">Créer l’abonnement</button>
      </div>
    </main>
  );
}
