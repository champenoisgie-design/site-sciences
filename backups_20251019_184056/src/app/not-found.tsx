import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="mb-2 text-2xl font-bold">Page introuvable</h1>
      <p className="text-zinc-500">La page demandée n’existe pas.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Revenir à l’accueil
      </Link>
    </div>
  )
}
