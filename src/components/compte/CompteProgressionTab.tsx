"use client";

import ProgressDashboardV2 from "./ProgressDashboardV2";

export default function CompteProgressionTab({ access }: { access: any }) {
  // Access check is inside the API summary; still keep minimal guard
  if (!access || (access.kind !== "FULL" && access.kind !== "TRIAL")) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Ma progression</h2>
        <p className="text-sm text-muted-foreground">
          La progression détaillée est disponible avec un abonnement actif (ou un essai en cours).
        </p>
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

  return <ProgressDashboardV2 />;
}
