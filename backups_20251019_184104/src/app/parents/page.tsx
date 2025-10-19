// src/app/parents/page.tsx
import { getSessionUser } from "../../lib/auth";
import { listChildrenForParent, getStudentProgressSummary } from "../../lib/parents";

export default async function ParentsPage() {
  const parent = await getSessionUser().catch(()=>null);
  if (!parent) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Espace Parents</h1>
        <p className="mt-2">Veuillez vous connecter.</p>
      </main>
    );
  }

  const children = await listChildrenForParent(parent.id);
  const targets = children.length ? children : [parent.id]; // démo: si aucun lien, on affiche le parent lui-même

  const summaries = await Promise.all(targets.map(async (uid) => ({
    userId: uid,
    ...(await getStudentProgressSummary(uid))
  })));

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Espace Parents</h1>
      <p className="mt-2 text-gray-600">Suivi des progrès : activité 14 jours, streak et badges.</p>

      <div className="mt-6 grid gap-6">
        {summaries.map((s, i) => (
          <div key={i} className="rounded-xl border p-4 bg-white">
            <div className="font-semibold">Élève: {s.userId}</div>
            <div className="mt-2 text-sm">Activités (14j): <strong>{s.total}</strong></div>
            <div className="mt-2 text-sm">Streak: <strong>{s.streak?.current ?? 0}</strong> (best {s.streak?.best ?? 0})</div>
            <div className="mt-2 text-sm">Badges: {s.badges.length === 0 ? <em>aucun</em> : s.badges.map((b:any)=> <span key={b.id} className="mr-2 rounded-full border px-2 py-0.5 text-xs">{b.badgeKey}</span>)}</div>

            <div className="mt-3">
              <details className="text-sm">
                <summary className="cursor-pointer">Détail par jour</summary>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-7 gap-2">
                  {Object.entries(s.perDay).map(([d, n]) => (
                    <div key={d} className="rounded border p-2">
                      <div className="text-xs text-gray-500">{d}</div>
                      <div className="font-semibold">{String(n)}</div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
