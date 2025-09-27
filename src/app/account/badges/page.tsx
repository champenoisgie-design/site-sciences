import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

const prisma = (globalThis as any).__prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma;

export default async function BadgesPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">Mes badges</h1>
        <p className="text-sm text-zinc-500">Veuillez vous connecter.</p>
      </div>
    );
  }

  const rows = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes badges</h1>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Aucun badge pour le moment. Abonne-toi et reviens ici 👀
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{r.badge.icon ?? '🏅'}</div>
                <div>
                  <div className="font-semibold">{r.badge.name}</div>
                  <div className="text-xs text-zinc-500">
                    Obtenu le {new Date(r.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {r.badge.description && (
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {r.badge.description}
                </p>
              )}
              {typeof r.badge.points === 'number' && (
                <div className="mt-3 inline-block rounded-full border px-2 py-0.5 text-xs">
                  {r.badge.points} pts
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
