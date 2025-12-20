import React from "react";
import Link from "next/link";

export const metadata = { title: "Thème One Piece — Site Sciences" };

function DemoExerciseCard({ index, title, items }: { index: number; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold">
          {index}
        </span>
        {title}
      </h3>
      <ul className="mt-2 text-xs text-muted-foreground space-y-1">
        {items.map((it, i) => (
          <li key={i}>• {it}</li>
        ))}
      </ul>
      <div className="mt-3">
        <a href="/exemples/onepiece/electricite" className="rounded-md border px-3 py-1 text-xs hover:bg-emerald-50">Voir un exemple guidé</a>
      </div>
    </div>
  );
}

export default function OnePieceThemePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <section className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        <div className="relative overflow-hidden rounded-2xl border bg-black">
          <video
            src="/themes/onepiece/preview.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            Très demandé (5ᵉ–4ᵉ)
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-extrabold shadow-md">
              ☠️
            </div>
            <div>
              <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                🎮 Thème visuel · One Piece
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Un univers d’aventure, des exercices exigeants</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            L’habillage aide à l’engagement, le contenu reste strictement aligné aux programmes. Idéal pour
            transformer les révisions en routine motivante.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Compatible avec toutes les matières et tous les niveaux</li>
            <li>• Aucun impact sur la difficulté ou la notation</li>
            <li>• Activable / désactivable à tout moment depuis le compte</li>
          </ul>

          <div className="flex flex-col gap-1 pt-2">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/preview/accueil?demo=onepiece"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:scale-[0.99] transition"
              >
                Essayer le thème
              </Link>
              <Link
                href="/panier?theme=onepiece"
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent active:scale-[0.99] transition"
              >
                Choisir ce thème
              </Link>
              <Link href="/tarifs" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
                Voir les tarifs
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Vous pouvez changer de thème à tout moment depuis votre compte.{" "}
              <Link href="/parents" className="underline underline-offset-4">
                Et pour les parents ?
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Exercices jouables (exemples)</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Quelques aperçus du type d’activités proposées avec l’habillage One Piece. Le contenu réel s’adapte à la
          matière et au niveau.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <DemoExerciseCard
            index={1}
            title="Proportionnalité & ravitaillement"
            items={[
              "« L’équipage consomme 4 barils d’eau pour 8 marins. Pour 14 marins ? »",
              "Compléter un tableau de proportionnalité",
              "Indice en cas d’erreur : coefficient multiplicateur",
            ]}
          />
          <DemoExerciseCard
            index={2}
            title="Vitesse / temps / distance"
            items={[
              "« Le Thousand Sunny navigue à 24 nœuds pendant 45 min : distance ? »",
              "Conversions d’unités guidées",
              "Validation immédiate + rappel de la formule",
            ]}
          />
          <DemoExerciseCard
            index={3}
            title="Électricité (schémas) — Physique"
            items={[
              "Placer correctement ampoule, générateur et interrupteur",
              "Identifier série/parallèle à partir d’un croquis",
              "Bilan : acquis / à revoir, partageable aux parents",
            ]}
          />
        </div>
      </section>
    </main>
  );
}
