import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { tutorials } from "@/lib/tutorials"

export async function generateStaticParams() {
  return tutorials.map(t => ({ slug: t.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const t = tutorials.find(x => x.slug === slug)
  if (!t) return { title: "Tutoriel introuvable" }
  return {
    title: `${t.title} | Site Sciences`,
    description: t.excerpt,
  }
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const t = tutorials.find(x => x.slug === slug)
  if (!t) notFound()

  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <p className="text-xs text-zinc-500">
        {t.subject} • {t.school === "college" ? "Collège" : "Lycée"} {t.grade} • MAJ {new Date(t.updatedAt).toLocaleDateString("fr-FR")}
      </p>
      <h1 className="mb-2">{t.title}</h1>
      <div style={{ whiteSpace: "pre-wrap" }}>{t.content}</div>
    </article>
  )
}
