import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Cours MP Concret
          </h1>
          <p className="mt-2 text-muted-foreground">
            Exercices corrigés, tutoriels vidéo et sessions live. Choisis ton mode
            d’apprentissage (TDAH, DYS, TSA, HPI) et ton univers visuel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/solo"
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
            >
              S’entraîner maintenant
            </Link>
            <Link
              href="/tutoriels"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Voir un tutoriel
            </Link>
            <Link
              href="/multijoueur"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Rejoindre le live
            </Link>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Extraits gratuits disponibles – pas de carte requise.
          </p>
        </div>

        <div className="rounded-lg border p-6 text-center">
          <div className="aspect-[16/9] w-full rounded-lg bg-gray-100" />
          <p className="mt-3 text-sm text-muted-foreground">Visuel d’accueil (à remplacer)</p>
        </div>
      </section>

      {/* CARTES */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Entraînement en solo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Séries d’exercices corrigés pas à pas, indices progressifs, XP.
          </p>
          <Link href="/solo" className="mt-4 inline-block rounded-lg border px-3 py-2 hover:bg-gray-50">
            Ouvrir
          </Link>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Tutoriels vidéo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Vidéos courtes (2–5 min), chapitrées, avec quiz et fiches.
          </p>
          <Link
            href="/tutoriels"
            className="mt-4 inline-block rounded-lg border px-3 py-2 hover:bg-gray-50"
          >
            Ouvrir
          </Link>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Multijoueur – Live</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Défis courts, chat, tableau interactif, classement amical.
          </p>
          <Link
            href="/multijoueur"
            className="mt-4 inline-block rounded-lg border px-3 py-2 hover:bg-gray-50"
          >
            Ouvrir
          </Link>
        </div>
      </section>

      {/* PRICING */}
      <section className="mt-12 rounded-lg border p-6">
        <p className="text-sm">
          Abonnements <strong>Normal</strong> • <strong>Gold</strong> • <strong>Platinium</strong> + achat à la demande.
        </p>
        <Link href="#" className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white hover:opacity-90">
          Voir les tarifs
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
        <p>© 2025 Cours MP Concret</p>
        <p className="flex flex-wrap gap-4 md:justify-end">
          <Link href="#">Mentions légales</Link>
          <Link href="#">CGU</Link>
          <Link href="#">Confidentialité</Link>
          <Link href="#">@CoursMPConcret</Link>
        </p>
      </footer>
    </main>
  );
}
