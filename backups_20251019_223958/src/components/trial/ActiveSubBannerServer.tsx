// src/components/trial/ActiveSubBannerServer.tsx
import { prisma } from "../../lib/prisma";
import { getSessionUser } from "../../lib/auth";

export default async function ActiveSubBannerServer() {
  const user = await getSessionUser().catch(() => null);
  if (!user) return null;

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "active", plan: { not: "trial" }, currentPeriodEnd: { gte: new Date() } },
    orderBy: { currentPeriodEnd: "desc" }
  });

  if (!sub?.currentPeriodEnd) return null;
  const ms = new Date(sub.currentPeriodEnd).getTime() - Date.now();
  if (ms <= 0) return null;
  const days = Math.ceil(ms / (24 * 3600 * 1000));

  return (
    <div className="w-full bg-emerald-50 border-b border-emerald-200">
      <div className="mx-auto max-w-6xl px-6 py-3 text-sm flex items-center justify-between">
        <div>
          <strong>Abonnement actif</strong> — il te reste <strong>{days} jour{days>1?"s":""}</strong>.
        </div>
        <a href="/mon-compte" className="underline">Gérer mon abonnement</a>
      </div>
    </div>
  );
}
