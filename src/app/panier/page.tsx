"use client";

import { useEffect, useMemo, useState } from "react";

type Plan = "normal" | "gold" | "platine";
type BillingPeriod = "mensuel" | "annuel";
type PriceResponse = {
  ok: true;
  subjectsCount: number;
  modesCount: number;
  plan: Plan;
  subtotalCents: number;
  subjectsDiscountCents: number;
  extraDiscountCents: number;
  totalCents: number;      // total mensuel (source serveur)
  billingPeriod?: BillingPeriod;
  annualCents?: number;    // présent si l'API l'envoie, sinon on calcule localement
} | { ok: false };

function centsToEuro(c: number) {
  return (c / 100).toFixed(2).replace(".", ",");
}

export default function PanierPage() {
  // Sélections de base : on garde ça simple pour restaurer le *calcul serveur*
  const [subjects, setSubjects] = useState<number>(1);
  const [modes, setModes] = useState<number>(0);
  const [plan, setPlan] = useState<Plan>("normal");
  const [billing, setBilling] = useState<BillingPeriod>("mensuel");

  const [loading, setLoading] = useState<boolean>(true);
  const [price, setPrice] = useState<PriceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchServerPrice() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart/price", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subjectsCount: subjects,
          modesCount: modes,
          plan,
          billingPeriod: billing,
        }),
      });
      const data = await res.json() as PriceResponse;
      if (!res.ok || !("ok" in data) || data.ok !== true) {
        throw new Error("Réponse serveur invalide");
      }
      setPrice(data);
    } catch (e: any) {
      setError(e?.message ?? "Erreur inconnue");
      setPrice(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServerPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, modes, plan, billing]);

  // Total annuel: si le serveur ne l'envoie pas, on calcule (-20% sur 12× mensuel)
  const derivedAnnual = useMemo(() => {
    if (price && "ok" in price && price.ok) {
      if (price.annualCents != null) return price.annualCents;
      return Math.round(price.totalCents * 12 * 0.8);
    }
    return null;
  }, [price]);

  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold">Panier</h1>
      <p className="mt-2 text-muted-foreground">Calcul 100% côté serveur via <code>/api/cart/price</code>.</p>

      {/* Contrôles simples pour piloter l'appel serveur */}
      <div className="mt-8 grid gap-4 md:grid-cols-4 max-w-4xl">
        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Matières</span>
          <input
            type="number" min={1} max={8}
            value={subjects}
            onChange={(e)=>setSubjects(parseInt(e.target.value || "1"))}
            className="w-24 rounded-lg border px-3 py-2"
          />
        </label>

        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Modes</span>
          <input
            type="number" min={0} max={3}
            value={modes}
            onChange={(e)=>setModes(parseInt(e.target.value || "0"))}
            className="w-24 rounded-lg border px-3 py-2"
          />
        </label>

        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Plan</span>
          <select value={plan} onChange={(e)=>setPlan(e.target.value as Plan)} className="w-40 rounded-lg border px-3 py-2">
            <option value="normal">Normal</option>
            <option value="gold">Gold (+5€)</option>
            <option value="platine">Platine (+10€)</option>
          </select>
        </label>

        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Période</span>
          <select value={billing} onChange={(e)=>setBilling(e.target.value as BillingPeriod)} className="w-40 rounded-lg border px-3 py-2">
            <option value="mensuel">Mensuel</option>
            <option value="annuel">Annuel</option>
          </select>
        </label>
      </div>

      {/* Affichage prix (source de vérité serveur) */}
      <section className="mt-8 max-w-3xl rounded-2xl border p-6">
        {loading && <p>Calcul en cours…</p>}
        {error && <p className="text-red-600">Erreur : {error}</p>}
        {!loading && !error && price && "ok" in price && price.ok && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Total (mensuel, serveur)</span>
              <strong>{centsToEuro(price.totalCents)} € / mois</strong>
            </div>
            {derivedAnnual != null && (
              <div className="flex items-center justify-between text-sm">
                <span>Équivalent annuel</span>
                <strong>{centsToEuro(derivedAnnual)} € / an</strong>
              </div>
            )}
            <hr className="my-3" />
            <div className="text-xs text-muted-foreground">
              Source: <code>/api/cart/price</code> — sujets: {subjects}, modes: {modes}, plan: {plan}, période: {billing}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
