import { notFound } from "next/navigation";
import Hero from "@/components/home/Hero";

const KNOWN = new Set(["onepiece", "mario", "dbz", "zelda"]);

export const metadata = { title: "Aperçu du thème" };

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!KNOWN.has(slug)) return notFound();

  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Thème “{slug}”</h1>
        <p>
          Voici un aperçu du thème <strong>{slug}</strong> : fond vidéo/poster,
          contraste adapté et badges/icônes personnalisables.
        </p>
        <p className="opacity-70 text-sm">
          Active “Réduire les animations” pour voir le poster statique.
        </p>
      </section>
    </main>
  );
}
