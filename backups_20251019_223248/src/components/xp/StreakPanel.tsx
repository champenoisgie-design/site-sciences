// src/components/xp/StreakPanel.tsx
import { getSessionUser } from "../../lib/auth";
import { getXPSummary } from "../../lib/xp";

export default async function StreakPanel() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return null;
  const data = await getXPSummary(user.id);

  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="font-semibold">🔥 Streak & Badges</div>
      <div className="mt-2 text-sm text-gray-700">Streak: <strong>{data.streak.current}</strong> (meilleur: {data.streak.best})</div>
      <div className="mt-2 text-sm">Badges: {data.badges.length === 0 ? <em>aucun</em> : data.badges.map(b => <span key={b.slug} className="mr-2 rounded-full border px-2 py-0.5 text-xs">{b.name}</span>)}</div>
    </div>
  );
}
