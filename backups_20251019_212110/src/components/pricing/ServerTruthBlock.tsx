// src/components/pricing/ServerTruthBlock.tsx
"use client";
import { useMemo, useState } from "react";
import { useServerPrice, type CartInput } from "../../hooks/useServerPrice";

export default function ServerTruthBlock() {
  async function checkoutServerTotal(total:number, plan?:string, billing?:string) {
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: total, plan: plan || "normal", billing: billing || "monthly" })
      });
      const json = await res.json();
      if (!res.ok || !json?.url) throw new Error(json?.error || "checkout_error");
      location.href = json.url;
    } catch (e:any) {
      alert(e?.message || "Erreur Checkout");
    }
  }
  // petit formulaire debug pour saisir les valeurs courantes du panier
  const [primaryPrice, setPrimaryPrice] = useState<number>(17.99);
  const [primarySubjects, setPrimarySubjects] = useState<number>(4);
  const [familyPrice, setFamilyPrice] = useState<number>(0);
  const [familySubjects, setFamilySubjects] = useState<number>(0);
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [isFirst100, setIsFirst100] = useState<boolean>(false);

  const input: CartInput = useMemo(() => ({
    currency: "EUR",
    primary: { basePrice: Number(primaryPrice)||0, subjectsCount: Number(primarySubjects)||0, meta: { plan: "—", billing: "—" } },
    familySecond: (Number(familyPrice)>0 ? { basePrice: Number(familyPrice)||0, subjectsCount: Number(familySubjects)||0, meta: { plan: "—", billing: "—" } } : null),
    hasReferral, isFirst100
  }), [primaryPrice, primarySubjects, familyPrice, familySubjects, hasReferral, isFirst100]);

  const { data, loading, error } = useServerPrice(input);

  return (
    <div className="mt-12 rounded-xl border bg-white">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="font-semibold">🧮 Source de vérité serveur (debug)</div>
        {loading && <span className="text-xs text-gray-500">calcul…</span>}
      </div>
      <div className="p-4 grid gap-3 md:grid-cols-2">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Ligne principale</div>
          <label className="text-xs">Prix base (€)</label>
          <input value={primaryPrice} onChange={e=>setPrimaryPrice(parseFloat(e.target.value)||0)} className="border rounded px-2 py-1" type="number" step="0.01"/>
          <label className="text-xs">Matières (nb)</label>
          <input value={primarySubjects} onChange={e=>setPrimarySubjects(parseInt(e.target.value||"0"))} className="border rounded px-2 py-1" type="number" min="0"/>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">Ligne Famille (optionnelle)</div>
          <label className="text-xs">Prix base (€)</label>
          <input value={familyPrice} onChange={e=>setFamilyPrice(parseFloat(e.target.value)||0)} className="border rounded px-2 py-1" type="number" step="0.01"/>
          <label className="text-xs">Matières (nb)</label>
          <input value={familySubjects} onChange={e=>setFamilySubjects(parseInt(e.target.value||"0"))} className="border rounded px-2 py-1" type="number" min="0"/>
        </div>
        <div className="col-span-full flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hasReferral} onChange={e=>setHasReferral(e.target.checked)} />
            Parrainage (-5%)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFirst100} onChange={e=>setIsFirst100(e.target.checked)} />
            100 premiers (-20%)
          </label>
        </div>
      </div>
      <div className="px-4 pb-4">
        {error && <div className="text-sm text-red-600">Erreur: {String(error)}</div>}
        {data && data.ok && (
          <div className="text-sm">
            <div className="mt-2">Total après remises de ligne: <strong>{data.totals.afterLineLevelDiscounts.toFixed(2)} €</strong></div>
            <div className="mt-1">Total final (serveur): <strong>{data.totals.grandTotal.toFixed(2)} €</strong></div>
            <div className="mt-2 text-xs text-gray-500">Ref (serveur): remises sujets {Math.round((data.lines.primary.subjectDiscountPct||0)*100)}% / famille {data.lines.familySecond?.familyDiscountPct ? Math.round(data.lines.familySecond.familyDiscountPct*100) : 0}% / parrainage {Math.round((data.discounts.referralPct||0)*100)}% / 100 premiers {Math.round((data.discounts.first100Pct||0)*100)}%</div>
          </div>
        )}
        {data && data.ok && (
          <div className="mt-3">
            <button
              onClick={() => checkoutServerTotal(
                Number(data?.totals?.grandTotal||0),
                String(data?.lines?.primary?.meta?.plan || "normal"),
                String(data?.lines?.primary?.meta?.billing || "monthly")
              )}
              className="rounded bg-black text-white px-4 py-2"
            >
              Payer ce total (test)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
