import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

const prisma = (globalThis as any).__prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma

export default async function AccountHome() {
  const user = await getCurrentUser()
  if (!user) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-2">Mon compte</h1>
        <p className="text-sm text-zinc-500">Veuillez vous connecter.</p>
      </section>
    )
  }

  const progresses = await prisma.userProgress.findMany({
    where: { userId: user.id },
    orderBy: [{ grade: 'asc' }, { subject: 'asc' }],
  })

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Mes progressions</h1>

      {progresses.length === 0 ? (
        <p className="text-sm text-zinc-500">Pas encore de progression.</p>
      ) : (
        <div className="space-y-4">
          {progresses.map((p: any) => {
            const badges = (() => {
              try {
                return p.badgesJson ? JSON.parse(p.badgesJson) : []
              } catch {
                return []
              }
            })()
            return (
              <div key={p.id} className="rounded-2xl border p-4">
                <div className="font-semibold">
                  {p.subject} · {p.grade}
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  XP : {p.xp ?? 0}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Badges :{' '}
                  {Array.isArray(badges) && badges.length > 0
                    ? badges.join(', ')
                    : '—'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

      <section className="mt-8 rounded-2xl border p-5 bg-emerald-50/70">
        <h2 className="text-sm font-semibold mb-1">Espace parents</h2>
        <p className="text-sm text-muted-foreground">
          Suis les progrès de ton enfant, le temps passé sur le site et les chapitres à revoir.
        </p>
        <div className="mt-3">
          <a
            href="/parents"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 active:scale-[0.99] transition"
          >
            Accéder à l’espace parents
          </a>
        </div>
      </section>
