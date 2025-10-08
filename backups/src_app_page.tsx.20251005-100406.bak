import Link from "next/link";
import type { ReactNode } from "react";
import LiveOnline from "@/components/ux/LiveOnline";

export const metadata = {
  title: "Site Sciences — Apprendre, s'entraîner, progresser",
  description: "Exercices en solo, tutoriels, progression, multi-joueur. Essai gratuit 3 jours.",
};

/* ===== Icônes SVG (taille contrôlée via className) ===== */
function IconExercise({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 4h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 10h6M9 14h6M9 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconTutorial({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6a2 2 0 0 1 2-2h9l3 3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 9h6M8 12h6M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 4v3h3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconMultiplayer({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 20a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 20a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconStar({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="m12 2 2.7 6.2 6.8.6-5.1 4.4 1.6 6.6L12 16.9 5.9 19.8l1.6-6.6-5.1-4.4 6.8-.6L12 2Z" />
    </svg>
  );
}
function IconChart({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6" y="11" width="3" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="7" width="3" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="4" width="3" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconPuzzle({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 3h3a2 2 0 0 1 2 2v1h1a2 2 0 1 1 0 4h-1v1a2 2 0 0 1-2 2H8v-3a2 2 0 1 1 0-4V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 13h3a2 2 0 0 1 2 2v1h1a2 2 0 1 1 0 4h-1v1a2 2 0 0 1-2 2H8v-3a2 2 0 1 1 0-4v-1a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ===== Carte interactive accessible ===== */
function CardLink(props: {
  href: string;
  title: string;
  desc: string;
  icon: ReactNode;
  gradient?: string;
  extra?: ReactNode;
}) {
  const { href, title, desc, icon, gradient, extra } = props;
  const g = gradient ?? "from-emerald-50 to-emerald-100/60 dark:from-slate-800 dark:to-slate-800/60";
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      aria-label={title}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${g} transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-0 transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:blur-sm bg-emerald-400/20" />
      <div className="relative p-6">
        <div className="flex items-start gap-3">
          <div className="text-emerald-700 dark:text-emerald-400"><div className="h-6 w-6">{icon}</div></div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>

        {/* zone extra (ex: compteur live) */}
        {extra ? <div className="mt-3">{extra}</div> : null}

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 underline-offset-4 group-hover:underline">
          Ouvrir
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M12.293 3.293a1 1 0 011.414 0L18 7.586a1 1 0 010 1.414l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 9H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Bandeau essai gratuit */}
      <div className="w-full bg-emerald-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-2 text-center text-sm sm:text-base">
          <strong>Inscris-toi et teste gratuitement pendant 3 jours</strong>
        </div>
      </div>

      {/* Bandeau “contenu adaptatif” (niveau & matière) */}
      <div className="w-full border-b bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-2 text-center text-xs sm:text-sm text-muted-foreground">
          Le contenu s’adapte à <em>ton niveau</em> et à <em>ta matière</em>. Tu pourras affiner ces choix depuis{" "}
          <Link href="/panier" className="underline underline-offset-4">le panier</Link> ou la{" "}
          <Link href="/faq" className="underline underline-offset-4">FAQ</Link>.
        </div>
      </div>

      {/* Hero + CTA */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              Apprendre plus vite, progresser sereinement
            </h1>
            <p className="mt-4 text-muted-foreground">
              Exercices guidés, tutoriels clairs, suivi de progression et défis multi-joueur. Les modes
              complémentaires (TDAH, DYS, TSA, HPI) s’appliquent à <em>toutes</em> les matières et
              à <em>tous</em> les niveaux.
            </p>

            {/* CTA e-mail non bloquant */}
            <form action="/register" method="get" className="mt-6 flex max-w-md gap-2">
              <input
                type="email"
                name="email"
                placeholder="Ton e-mail"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                aria-label="Adresse e-mail"
              />
              <button
                type="submit"
                className="rounded-lg border border-emerald-700 bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 active:scale-[0.99] transition-transform"
              >
                Commencer l’essai
              </button>
            </form>

            <div className="mt-4 text-sm text-muted-foreground">
              Déjà inscrit ?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
                Me connecter
              </Link>
            </div>

            <div className="mt-6">
              <Link
                href="/panier"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent active:scale-[0.99] transition"
              >
                Choisir mon niveau et ma matière
              </Link>
            </div>
          </div>

          {/* Encadré bénéfices */}
          <div className="rounded-2xl border p-6">
            <ul className="space-y-3 text-sm">
              <li>✔️ Exercices interactifs et explications pas à pas</li>
              <li>✔️ Suivi de ta progression par chapitre</li>
              <li>✔️ Multi-joueur ludique : révise en t’amusant</li>
              <li>✔️ Conseils adaptés (TDAH, DYS, TSA, HPI)</li>
              <li>✔️ Mode Famille disponible avec remise dédiée</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Grille de sections (2 lignes / 3 colonnes) */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Ligne 1 */}
          <CardLink
            href="/exercices"
            title="Exercices en solo"
            desc="Entraîne-toi à ton rythme avec corrections immédiates et rappels de méthode."
            icon={<IconExercise />}
            gradient="from-emerald-50 to-emerald-100/70 dark:from-slate-800 dark:to-slate-800/60"
          />
          <CardLink
            href="/tutoriels"
            title="Tutoriels"
            desc="Explications claires, exemples progressifs et astuces concrètes."
            icon={<IconTutorial />}
            gradient="from-sky-50 to-sky-100/70 dark:from-slate-800 dark:to-slate-800/60"
          />
          <CardLink
            href="/multijoueur"
            title="Multi-joueur"
            desc="Défis en live, mini-jeux et classements : révise en t’amusant, seul ou avec tes amis."
            icon={<IconMultiplayer />}
            gradient="from-violet-50 to-violet-100/70 dark:from-slate-800 dark:to-slate-800/60"
            extra={<LiveOnline />}
          />

          {/* Ligne 2 */}
          <CardLink
            href="/favoris"
            title="Ta sélection"
            desc="Retrouve vite les chapitres et exercices que tu as mis en favori."
            icon={<IconStar />}
            gradient="from-amber-50 to-amber-100/70 dark:from-slate-800 dark:to-slate-800/60"
          />
          <CardLink
            href="/progression"
            title="Ta progression"
            desc="Suis tes réussites, repère les notions à revoir et débloque des badges."
            icon={<IconChart />}
            gradient="from-rose-50 to-rose-100/70 dark:from-slate-800 dark:to-slate-800/60"
          />
          <CardLink
            href="/faq"
            title="Modes complémentaires"
            desc="Active TDAH, DYS, TSA ou HPI : appliqués à toutes les matières et tous les niveaux."
            icon={<IconPuzzle />}
            gradient="from-teal-50 to-teal-100/70 dark:from-slate-800 dark:to-slate-800/60"
          />
        </div>
      </section>

      {/* Nouveautés (squelettes prêts à brancher) */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nouveautés</h2>
          <Link href="/tutoriels" className="text-sm underline underline-offset-4">Voir tout</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((k) => (
            <div key={k} className="rounded-2xl border p-4">
              <div className="h-36 w-full animate-pulse rounded-xl bg-muted" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>

      {/* Bandeau bas de page vers Tarifs */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tu veux comparer les plans ? Les prix s’ajustent en direct selon ta matière,
            ton niveau et le mode Famille.
          </p>
          <div className="mt-4">
            <Link
              href="/tarifs"
              className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-accent active:scale-[0.99] transition"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
