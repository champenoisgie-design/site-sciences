'use client'
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="py-20 text-center">
      <h1 className="mb-2 text-xl font-semibold">Une erreur est survenue</h1>
      <p className="text-zinc-500 text-sm">{error.message}</p>
    </div>
  )
}
