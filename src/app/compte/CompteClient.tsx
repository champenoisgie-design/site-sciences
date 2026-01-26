"use client";

import React, { useEffect, useState } from "react";
import { AccountTabPinGuard } from "@/components/parent-pin/AccountTabPinGuard";
import { useRouter, useSearchParams } from "next/navigation";

type SimpleUser = { id: string; email?: string | null; name?: string | null } | null;

type TabId = "progression" | "abonnement" | "badges" | "parents";

const TABS: { id: TabId; label: string }[] = [
  { id: "progression", label: "Ma progression" },
  { id: "abonnement", label: "Mon abonnement" },
  { id: "badges", label: "Badges" },
  { id: "parents", label: "Parents" },
];

export default function CompteClient({ user }: { user: SimpleUser }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialTab = (params.get("tab") as TabId) || "progression";
  const [tab, setTab] = useState<TabId>(initialTab);

  useEffect(() => {
    const q = (params.get("tab") || "") as TabId | "";
    const next: TabId = (q === "abonnement" || q === "parents" || q === "badges" || q === "progression") ? q : "progression";
    if (next !== tab) setTab(next);
  }, [params, tab]);


  // Pour l'instant, un seul élève, mais l'UI est prête pour plusieurs.
  const students = [
    {
      id: "eleve-1",
      label: user?.name || user?.email || "Moi",
    },
  ];
  const [studentId, setStudentId] = useState<string>(students[0]?.id ?? "eleve-1");
  const currentStudent = students.find((s) => s.id === studentId) ?? students[0];

  // Stub : plus tard, on branchera ça sur le vrai plan (Gold / Platine).
  const hasParentPremium = true; // TODO: connecter à l'abonnement réel

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <AccountTabPinGuard />
      <header className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Connecté en tant que{" "}
          <span className="font-medium">{user?.email ?? "utilisateur"}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold">Mon compte</h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Onglets */}
        <nav className="inline-flex rounded-full bg-muted p-1 text-xs sm:text-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => router.push(`/compte?tab=${t.id}`)}
              className={[
                "px-3 sm:px-4 py-1.5 rounded-full transition",
                tab === t.id
                  ? "bg-white shadow-sm text-black"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Sélecteur d'élève (mode famille prêt) */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-muted-foreground">Élève :</span>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="rounded-full border px-3 py-1 text-xs sm:text-sm bg-white"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenu d'onglet */}
      <section className="rounded-2xl border bg-white p-4 sm:p-6">
        {tab === "progression" && <TabProgression studentLabel={currentStudent.label} />}
        {tab === "abonnement" && <TabAbonnement />}
        {tab === "badges" && <TabBadges />}
        {tab === "parents" && (
          <TabParents studentLabel={currentStudent.label} hasPremium={hasParentPremium} />
        )}
      </section>
    </main>
  );
}

/* -------------------- Onglet : Ma progression -------------------- */

function TabProgression({ studentLabel }: { studentLabel: string }) {
  const xp = 65; // %
  const weeklySessions = 4;
  const currentChapter = "Mécanique – Forces et mouvements";
  const avatarForm = "Super saiyan 1 (démo)";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Progression de {studentLabel}</h2>
          <p className="text-sm text-muted-foreground">
            Vue d&apos;ensemble de tes chapitres, de ton XP et de tes dernières réussites.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Mode famille prêt : cette vue s&apos;adaptera à l&apos;élève sélectionné.
        </div>
      </div>

      {/* Ligne de cartes statistiques */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">XP globale</p>
          <p className="mt-1 text-2xl font-bold">{xp}%</p>
          <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${xp}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Plus tu termines de chapitres, plus ta barre d&apos;XP se remplit.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Séances cette semaine</p>
          <p className="mt-1 text-2xl font-bold">{weeklySessions}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Objectif recommandé : 3 à 5 séances de 20–30 minutes.
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Chapitre en cours</p>
          <p className="mt-1 text-sm font-medium">{currentChapter}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Tu peux reprendre exactement là où tu t&apos;es arrêté.
          </p>
        </div>
      </div>

      {/* Bloc personnage / thème */}
      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-stretch">
        <div className="rounded-xl border p-4 bg-gradient-to-br from-amber-50 to-emerald-50">
          <p className="text-xs text-muted-foreground">Ton personnage (ex : thème Dragon Ball Z)</p>
          <p className="mt-1 text-sm font-semibold">{avatarForm}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Les formes de ton héros évoluent automatiquement quand tu gagnes de l&apos;XP
            et que tu termines des chapitres clés (Super saiyan 1, 2, etc.).
          </p>
          <p className="mt-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-amber-700">
            ⚡ Exemple : « Badge Super saiyan 1 » débloqué
          </p>
        </div>

        {/* Encarts de félicitations */}
        <div className="space-y-3">
          <div className="rounded-xl border p-4 bg-emerald-50/70">
            <p className="text-xs font-semibold text-emerald-800">Bravo 🎉</p>
            <p className="mt-1 text-sm">
              Tu as terminé le chapitre <span className="font-medium">Mécanique</span>.
            </p>
            <p className="mt-1 text-xs text-emerald-900">
              Tu débloques un badge, et ton personnage passe au niveau suivant.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold">Prochaine étape</p>
            <p className="mt-1 text-sm">
              Lance le chapitre <span className="font-medium">Énergie et puissance</span> pour continuer ta progression.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Un rappel doux peut être envoyé aux parents en cas de pause trop longue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Onglet : Mon abonnement -------------------- */

function TabAbonnement() {
  const [sub, setSub] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/billing/subscription", { cache: "no-store" })
      .then(r => r.json())
      .then(j => setSub(j.subscription))
      .catch(() => {});
  }, []);

  if (!sub) {
    return <p className="text-sm text-muted-foreground">Aucun abonnement actif.</p>;
  }

  const subjects = (() => {
    try {
      return JSON.parse(sub.subjectsJson || "{}").subjects;
    } catch {
      return "";
    }
  })();

  const expired = new Date(sub.currentPeriodEnd) < new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Mon abonnement</h2>
        <p className="text-sm text-muted-foreground">
          Données réelles synchronisées avec Stripe.
        </p>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold">
              Offre {sub.plan} — {sub.grade}
            </p>
            <p className="text-xs text-muted-foreground">{subjects}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${expired ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
            {expired ? "Expiré" : "Actif"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Fin : {new Date(sub.currentPeriodEnd).toLocaleDateString("fr-FR")}
        </p>

        <div className="pt-3 flex gap-2">
          <a href="/panier" className="rounded-lg border px-3 py-1.5 text-xs hover:bg-accent">
            Modifier
          </a>
          {expired && (
            <a href="/tarifs" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700">
              Renouveler
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Onglet : Badges -------------------- */

function TabBadges() {
  const badges = [
    { key: "first_chapter", label: "Premier chapitre terminé", unlocked: true },
    { key: "streak_5", label: "5 jours d’affilée", unlocked: false },
    { key: "ssj1", label: "Super saiyan 1", unlocked: true },
    { key: "ssj2", label: "Super saiyan 2", unlocked: false },
    { key: "speedrunner", label: "Mode speedrun maîtrisé", unlocked: false },
    { key: "family_team", label: "Famille au complet", unlocked: false },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Badges</h2>
        <p className="text-sm text-muted-foreground">
          Tous les badges possibles s&apos;affichent ici. Ceux que tu as déjà obtenus
          sont en couleur, les autres restent en gris avec une indication pour les débloquer.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
        {badges.map((b) => (
          <div
            key={b.key}
            className={[
              "group rounded-xl border p-3 text-center text-xs cursor-default transition",
              b.unlocked
                ? "bg-amber-50 border-amber-200"
                : "bg-muted text-muted-foreground opacity-70",
            ].join(" ")}
          >
            <div className="text-2xl mb-1">
              {b.unlocked ? "🏅" : "🎖️"}
            </div>
            <p className="font-medium">{b.label}</p>
            <p className="mt-1 text-[11px] text-muted-foreground group-hover:opacity-100">
              {b.key === "first_chapter" && "Terminer ton tout premier chapitre."}
              {b.key === "streak_5" && "Réviser au moins 5 jours d’affilée."}
              {b.key === "ssj1" && "Atteindre la première transformation de ton héros."}
              {b.key === "ssj2" && "Atteindre un niveau d’XP plus élevé (Super saiyan 2)."}
              {b.key === "speedrunner" && "Finir plusieurs séries en mode chronométré."}
              {b.key === "family_team" && "Ajouter plusieurs élèves via le mode Famille."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Onglet : Parents -------------------- */

function TabParents({ studentLabel, hasPremium }: { studentLabel: string; hasPremium: boolean }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Vue Parents</h2>
        <p className="text-sm text-muted-foreground">
          {hasPremium
            ? `Détail complet de la progression de ${studentLabel} (offre Gold / Platine).`
            : `Récapitulatif hebdomadaire simplifié de la progression de ${studentLabel}.`}
        </p>
      </div>

      {hasPremium ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4 bg-muted/40">
              <h3 className="text-sm font-semibold mb-1">Synthèse hebdomadaire</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 4 séances cette semaine (80 minutes)</li>
                <li>• 3 chapitres travaillés, 1 chapitre terminé</li>
                <li>• Régularité jugée « bonne »</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4 bg-muted/40">
              <h3 className="text-sm font-semibold mb-1">Détail par matière</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Maths 4ᵉ : mécanique (terminé), fractions (à renforcer)</li>
                <li>• Physique : circuits électriques simples (en cours)</li>
                <li>• Statut général : progression conforme aux objectifs</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4 bg-muted/40">
              <h3 className="text-sm font-semibold mb-1">Badge & motivation</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Nouveau badge : « Premier chapitre mécanique »</li>
                <li>• Prochain badge proche : « 5 jours d’affilée »</li>
                <li>• Suggestion : 2 petites séances supplémentaires sur les fractions</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-emerald-50/80">
            <p className="text-sm font-semibold text-emerald-900">
              Conseils personnalisés pour les parents
            </p>
            <p className="mt-1 text-xs text-emerald-900">
              Cette vue est conçue pour une lecture rapide (2–3 minutes). L&apos;objectif est
              d&apos;avoir une discussion positive avec l&apos;élève : félicitations, points forts,
              et une seule priorité de travail pour la semaine suivante.
            </p>
            <p className="mt-2 text-xs text-emerald-900">
              Vous pouvez exporter ces informations (PDF / e-mail) ou recevoir un récap automatique
              chaque semaine (option Gold / Platine).
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4 bg-muted/40">
              <h3 className="text-sm font-semibold mb-1">Chapitres travaillés (exemple)</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Maths (4ᵉ) : Mécanique (3 séances), Proportionnalité (1 séance)</li>
                <li>• Physique : Électricité – circuits simples (2 séances)</li>
                <li>• Statut : Mécanique = en bonne voie, Fractions = prioritaire</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4 bg-muted/40">
              <h3 className="text-sm font-semibold mb-1">Temps & régularité</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 80 min de travail sur 4 séances cette semaine</li>
                <li>• Séances de 20 minutes, adaptées à l’attention</li>
                <li>• Rythme recommandé atteint</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4 bg-muted/40">
              <h3 className="text-sm font-semibold mb-1">1 point fort / 1 priorité</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Point fort : Géométrie – 8 réussites consécutives</li>
                <li>• Priorité : Fractions – erreurs fréquentes sur la simplification</li>
                <li>• Prochaine étape : relancer 1 tutoriel ciblé + 6 exercices guidés</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-emerald-50/80">
            <p className="text-sm font-semibold text-emerald-900">
              Moins de stress, plus d&apos;échanges positifs
            </p>
            <p className="mt-1 text-xs text-emerald-900">
              L&apos;idée est que les parents consultent cette vue une fois par semaine,
              plutôt que de vérifier chaque jour. L&apos;énergie est mise sur
              l&apos;encouragement et les priorités, pas sur la surveillance permanente.
            </p>
            <p className="mt-2 text-xs text-emerald-900">
              Une page dédiée <code>/parents</code> reste disponible pour une présentation détaillée.
            </p>
          </div>
        </>
      )}
    </div>
  );
}