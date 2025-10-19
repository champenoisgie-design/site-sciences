// src/components/trial/PaidSuccessNotice.tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function PaidSuccessNotice() {
  const sp = useSearchParams();
  const paid = sp.get("paid") === "1";
  if (!paid) return null;
  return (
    <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm">
      <div className="font-semibold">🎉 Paiement confirmé</div>
      <p className="mt-1 text-emerald-900">
        Ton abonnement est actif. Tu peux accéder à toutes les matières et niveaux couverts par ton plan.
      </p>
      <div className="mt-3">
        <a href="/cours" className="rounded bg-emerald-600 text-white px-3 py-2">Accéder aux cours</a>
      </div>
    </div>
  );
}
