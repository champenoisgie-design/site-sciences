// src/components/trial/TrialExpiredNotice.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function TrialExpiredNotice() {
  const sp = useSearchParams();
  const expired = sp.get("trial") === "expired";
  if (!expired) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <div className="font-semibold">Essai gratuit terminé</div>
      <p className="mt-1 text-amber-900">
        Ton essai de 3 jours est terminé. Choisis un plan pour continuer l’accès à toutes les matières et niveaux.
      </p>
      <div className="mt-3 flex gap-2">
        <a href="#plans" className="rounded-lg border border-amber-300 px-3 py-2">Voir les plans</a>
        <a href="/faq" className="rounded-lg px-3 py-2 underline">Questions fréquentes</a>
      </div>
    </div>
  );
}
