import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AllBadgesPage() {
  const badges = await prisma.badge.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Tous les badges</h1>
      <p className="text-sm text-gray-600 mb-6">
        Découvrez les badges disponibles et comment les obtenir.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((b) => (
          <div key={b.key} className="border rounded p-4">
            <div className="text-2xl">{(b as any).icon ?? '🏅'}</div>
            <div className="font-semibold mt-2">{(b as any).name ?? b.key}</div>
            {(b as any).description ? (
              <p className="text-sm mt-1">{(b as any).description}</p>
            ) : null}
            {(b as any).points != null ? (
              <div className="text-xs text-gray-500 mt-2">
                {(b as any).points} pts
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
