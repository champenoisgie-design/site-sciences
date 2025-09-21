import Link from "next/link"
import ChangePasswordCard from "@/components/ChangePasswordCard"
import { requireUserOrRedirect } from "@/lib/server-auth"

export const dynamic = "force-dynamic"

export default async function Page() {
  const user = await requireUserOrRedirect()

  if (!user) {
    return (
      <section className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <Link href="/login" className="rounded px-3 py-2 border text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Se connecter
        </Link>
      </section>
    )
  }

  return (
    <section className="grid gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Mon compte</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Connecté en tant que <span className="font-medium">{user.name ?? user.email}</span>
        </p>
      </div>
      <ChangePasswordCard />
    </section>
  )
}
