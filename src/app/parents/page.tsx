import React from "react";
import Link from "next/link";

export const metadata = { title: "Espace parents — Site Sciences" };

export default function ParentsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <header className="space-y-3">
        <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          👨‍👩‍👧 Espace parents
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Des informations claires pour décider sereinement
        </h1>
        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
          En quelques minutes par semaine, vous voyez si votre enfant progresse, où il faut consolider,
          et comment l’encourager — sans transformer la maison en salle de classe.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-5 bg-white">
          <h2 className="text-sm font-semibold mb-2">1. Tableau de bord lisible</h2>
          <p className="text-sm text-muted-foreground">
            Matières, niveau et chapitres codés par couleur : vert = acquis, orange = à consolider, rouge = prioritaire.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Exemple : « Fractions (5ᵉ) » en rouge, « Géométrie » en vert → vous savez quoi revoir en premier.
          </p>
        </div>
        <div className="rounded-2xl border p-5 bg-white">
          <h2 className="text-sm font-semibold mb-2">2. Temps et régularité</h2>
          <p className="text-sm text-muted-foreground">
            Résumé hebdomadaire du temps passé, du nombre d’exercices réalisés et des jours actifs.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Exemple : « 3 séances cette semaine (75 min) » ou « Alerte douceur : aucune séance depuis 4 jours ».
          </p>
        </div>
        <div className="rounded-2xl border p-5 bg-white">
          <h2 className="text-sm font-semibold mb-2">3. Besoins spécifiques</h2>
          <p className="text-sm text-muted-foreground">
            Visibilité sur les modes activés (TDAH, DYS, TSA, HPI) et leur impact : pas-à-pas, taille de police,
            consignes guidées, découpage des tâches…
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Exemple : pour un profil TDAH, les séances sont courtes et rythmées, avec feedback positif.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border p-6 bg-muted/40">
        <h2 className="text-sm font-semibold mb-3">Chaque semaine, vous voyez :</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-4">
            <h3 className="text-sm font-semibold mb-1">Chapitres travaillés</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Maths (5ᵉ) : Fractions (3 séances), Proportionnalité (1 séance)</li>
              <li>• Physique (4ᵉ) : Électricité – circuits simples (2 séances)</li>
              <li>• Statut : Fractions = prioritaire, Proportionnalité = en cours</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <h3 className="text-sm font-semibold mb-1">Temps passé</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 75 min au total · 3 jours actifs (lun/mer/sam)</li>
              <li>• Séances de 20–30 min, adaptées à l’attention</li>
              <li>• Rythme recommandé atteint</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <h3 className="text-sm font-semibold mb-1">1 point fort / 1 priorité</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Point fort :</strong> Géométrie : 8 réussites consécutives</li>
              <li>• <strong>Priorité :</strong> Fractions : erreurs récurrentes sur la simplification</li>
              <li>• Proposition : relancer 1 tutoriel ciblé + 6 exercices guidés</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border p-6 bg-emerald-600 text-white">
        <h2 className="text-lg font-semibold mb-2">Moins de stress, plus d’échanges positifs</h2>
        <p className="text-sm text-emerald-50">
          Vous remplacez les interrogations quotidiennes par un suivi hebdomadaire clair.
          L’énergie est mise sur l’encouragement et les priorités, pas sur la surveillance.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/preview/accueil?demo=mario" className="rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-white">
            Voir un aperçu élève
          </Link>
          <Link href="/tarifs" className="rounded-lg border border-emerald-100/70 px-4 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-500/40">
            Comparer les plans
          </Link>
          <Link href="/faq" className="text-sm underline underline-offset-4 text-emerald-50">
            FAQ parents
          </Link>
        </div>
      </section>
    </main>
  );
}
