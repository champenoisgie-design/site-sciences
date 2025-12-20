import React from "react";
import Link from "next/link";

export const metadata = { title: "Thème Mario — Site Sciences" };

function DemoExerciseCard({ index, title, items }: { index: number; title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold">{index}</span>
        {title}
      </h3>
      <ul className="mt-2 text-xs text-muted-foreground space-y-1">
        {items.map((it, i) => (<li key={i}>• {it}</li>))}
      </ul>
      <div className="mt-3">
        <a href="/exemples/mario/speedrun" className="rounded-md border px-3 py-1 text-xs hover:bg-emerald-50">Voir un exemple guidé</a>
      </div>
    </div>
  );
}

export default function MarioThemePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <section className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        <div className="relative overflow-hidden rounded-2xl border bg-black">
          <video src="/themes/mario/preview.mp4" autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            Préféré des collégiens (5ᵉ–4ᵉ)
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white text-xl font-extrabold shadow-md">M</div>
            <div>
              <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                🎮 Thème visuel · Mario
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Un habillage ludique, un contenu rigoureux</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            L’univers évoque le jeu vidéo, mais les exercices restent conformes aux programmes.
            Objectif : déclencher l’envie de s’y mettre, sans baisser les exigences.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Compatible avec toutes les matières et tous les niveaux</li>
            <li>• Aucun impact sur la difficulté ou la notation</li>
            <li>• Activable / désactivable à tout moment depuis le compte</li>
          </ul>

          <div className="flex flex-col gap-1 pt-2">
            <div className="flex flex-wrap gap-3">
              <Link href="/preview/accueil?demo=mario" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:scale-[0.99] transition">
                Essayer le thème
              </Link>
              <Link href="/panier?theme=mario" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent active:scale-[0.99] transition">
                Choisir ce thème
              </Link>
              <Link href="/tarifs" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
                Voir les tarifs
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Vous pouvez changer de thème à tout moment depuis votre compte.{" "}
              <Link href="/parents" className="underline underline-offset-4">Et pour les parents ?</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Exercices jouables (exemples)</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Illustrations du type d’activités proposées avec l’habillage Mario. Le contenu réel s’adapte à la matière et au niveau.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <DemoExerciseCard index={1} title="Fractions & pièces" items={["« Mario récupère 3 pièces sur 5 : quelle fraction ? »","Glisser-déposer des pièces dans les blocs","Aide : simplifier une fraction pas à pas"]}/>
          <DemoExerciseCard index={2} title="Proportionnalité" items={["« 3 champignons par joueur : compléter le tableau »","Identifier le coefficient multiplicateur","Validation immédiate + indice en cas d’erreur"]}/>
          <DemoExerciseCard index={3} title="Révisions rapides" items={["Série de questions chronométrées (mode speedrun)","Indicateur monde 1-1 → 1-4","Bilan : acquis / à revoir, partageable aux parents"]}/>
        </div>
      </section>
    </main>
  );
}
