// src/app/page.tsx
import Link from "next/link";

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Cours MP Concret
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Exercices corrigés, tutoriels vidéo et sessions live. Choisis ton
            mode d’apprentissage (TDAH, DYS, TSA, HPI) et ton univers visuel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLink href="/solo">S’entraîner maintenant</PrimaryLink>
            <PrimaryLink href="/tutoriels">Voir un tutoriel</PrimaryLink>
            <PrimaryLink href="/multijoueur">Rejoindre le live</PrimaryLink>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Extraits gratuits disponibles – pas de carte requise.
          </p>
        </div>

        <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-500">
          Visuel d’accueil (à remplacer)
        </div>
      </section>

      {/* MODE SELECTORS */}
      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Thème visuel</label>
          <select className="mt-1 w-full rounded-md border-gray-300 shadow-sm">
            <option>Anime-combat</option>
            <option>Science-fiction</option>
            <option>Fantasy</option>
            <option>Minimaliste</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Mode d’apprentissage</label>
          <select className="mt-1 w-full rounded-md border-gray-300 shadow-sm">
            <option>Normal</option>
            <option>TDAH</option>
            <option>DYS</option>
            <option>TSA</option>
            <option>HPI</option>
          </select>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-16 grid gap-8 sm:grid-cols-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-600">
            Entraînement en solo
          </h3>
          <p className="mt-2 text-gray-600">
            Séries d’exercices corrigés pas à pas, indices progressifs, XP.
          </p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-green-600">
            Tutoriels vidéo
          </h3>
          <p className="mt-2 text-gray-600">
            Vidéos courtes (2–5 min), chapitrées, avec quiz et fiches.
          </p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-purple-600">
            Multijoueur – Live
          </h3>
          <p className="mt-2 text-gray-600">
            Défis courts, chat, tableau interactif, classement amical.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="mt-16 text-center">
        <p className="text-gray-700">
          Abonnements <strong>Normal</strong> • <strong>Gold</strong> •{" "}
          <strong>Platinium</strong> + achat à la demande.
        </p>
        <Link
          href="/tarifs"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition"
        >
          Voir les tarifs
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 border-t pt-6 text-sm text-gray-500 text-center">
        <p>© 2025 Cours MP Concret</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="#">Mentions légales</Link>
          <Link href="#">CGU</Link>
          <Link href="#">Confidentialité</Link>
          <Link href="#">@CoursMPConcret</Link>
        </div>
      </footer>
    </main>
  );
}
