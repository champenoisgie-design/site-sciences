import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

export default async function BadgesPage() {
  const user = await getCurrentUser()
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mes badges</h1>
        <p>Veuillez vous connecter pour voir vos badges.</p>
      </div>
    )
  }

  let items: {
    id: string
    userId: string
    badgeKey: string
    earnedAt: any
    metaJson: string | null
    badge: any | null
  }[] = []

  const hasModel = Boolean((prisma as any).userBadge)
  if (hasModel) {
    const rows = await (prisma as any).userBadge.findMany({
      where: { userId: user.id },
      orderBy: { earnedAt: 'desc' },
      include: { Badge: true },
    })
    items = rows
  } else {
    // Fallback SQL (jointure manuelle) — fonctionne même si le client n'expose pas userBadge
    const rows = await prisma.$queryRaw<Array<any>>`
      SELECT ub.id, ub.userId, ub.badgeKey, ub.earnedAt, ub.metaJson,
             b.key as b_key, b.name as b_name, b.description as b_description, b.icon as b_icon, b.points as b_points
      FROM UserBadge ub
      LEFT JOIN Badge b ON b.key = ub.badgeKey
      WHERE ub.userId = ${user.id}
      ORDER BY ub.earnedAt DESC
    `
    items = rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      badgeKey: r.badgeKey,
      earnedAt: r.earnedAt,
      metaJson: r.metaJson ?? null,
      badge: r.b_key
        ? {
            key: r.b_key,
            name: r.b_name,
            description: r.b_description,
            icon: r.b_icon,
            points: r.b_points,
          }
        : null,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mes badges</h1>
      {items.length === 0 ? (
        <p>Vous n’avez pas encore de badge.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="p-4 border rounded">
              <div className="font-semibold">
                {it.badge?.name ?? it.badgeKey}
              </div>
              {it.badge?.description ? (
                <p className="text-sm mt-1">{it.badge.description}</p>
              ) : null}
              <div className="text-sm text-gray-600">
                Obtenu le{' '}
                {new Intl.DateTimeFormat('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }).format(new Date(it.earnedAt))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
