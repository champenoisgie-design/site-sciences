// src/components/trial/TrialBannerServer.tsx
import { trialDaysLeft } from "../../lib/trial";
import { getSessionUser } from "../../lib/auth";

export default async function TrialBannerServer() {
  const user = await getSessionUser().catch(() => null);
  if (!user) return null;

  const days = await trialDaysLeft(user.id).catch(() => 0);
  if (!days || days <= 0) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm flex items-center justify-between">
        <div>
          <strong>Essai gratuit</strong> — il te reste <strong>{days} jour{days > 1 ? "s" : ""}</strong>.
        </div>
        <a href="/panier" className="underline">Passer à l’abonnement</a>
      </div>
    </div>
  );
}
