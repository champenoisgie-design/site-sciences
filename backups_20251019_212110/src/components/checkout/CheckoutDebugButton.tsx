// src/components/checkout/CheckoutDebugButton.tsx
"use client";
import { useState } from "react";

export default function CheckoutDebugButton() {
  const [amount, setAmount] = useState<number>(17.99);
  const [plan, setPlan] = useState<string>("normal");
  const [billing, setBilling] = useState<string>("monthly");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount, plan, billing })
      });
      const json = await res.json();
      if (!res.ok || !json?.url) throw new Error(json?.error || "checkout_error");
      location.href = json.url;
    } catch (e:any) {
      alert(e?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border p-4">
      <div className="font-medium">💳 Test Checkout (debug)</div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <label className="text-sm">Montant (€)
          <input type="number" step="0.01" value={amount} onChange={e=>setAmount(parseFloat(e.target.value)||0)} className="mt-1 w-full border rounded px-2 py-1"/>
        </label>
        <label className="text-sm">Plan
          <select value={plan} onChange={e=>setPlan(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
            <option value="normal">normal</option>
            <option value="gold">gold</option>
            <option value="platine">platine</option>
          </select>
        </label>
        <label className="text-sm">Facturation
          <select value={billing} onChange={e=>setBilling(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
            <option value="monthly">mensuel</option>
            <option value="annual">annuel</option>
          </select>
        </label>
      </div>
      <button onClick={pay} disabled={loading} className="mt-3 rounded bg-black text-white px-4 py-2">
        {loading ? "Redirection…" : "Payer (test)"}
      </button>
    </div>
  );
}
