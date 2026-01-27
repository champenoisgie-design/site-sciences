'use client'

import { useState } from "react";
import { fetchWithParentPinRetry } from "@/components/parent-pin/fetchWithParentPinRetry";

/**
 * ServerTruthBlock
 * Petit bloc debug/marketing qui appelle /api/checkout/session
 * IMPORTANT: l'appel doit passer par fetchWithParentPinRetry(url, options, openParentPin)
 */
export default function ServerTruthBlock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // placeholders (selon ton usage réel, tu peux les remplacer)
  const total = 999;
  const plan = "normal";
  const billing = "monthly";

  async function openParentPin() {
    // placeholder: fetchWithParentPinRetry va ouvrir le modal PIN si besoin
    // si tu as déjà une fonction existante dans le projet, on pourra la brancher ensuite
  }

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetchWithParentPinRetry(
        "/api/checkout/session",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            amount: total,
            plan,
            billing,
          }),
        },
        openParentPin
      );

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || "checkout_error");
      }

      window.location.href = json.url;
    } catch (e: any) {
      setError(e?.message || "checkout_error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm font-semibold">Vérité serveur (checkout)</div>
      <div className="mt-1 text-xs text-muted-foreground">
        Debug: appelle /api/checkout/session avec retry PIN si nécessaire.
      </div>

      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {loading ? "..." : "Tester checkout"}
      </button>
    </div>
  );
}
