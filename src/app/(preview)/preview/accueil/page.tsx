// src/app/(preview)/preview/accueil/page.tsx
"use client";

import { useState } from "react";
import PreviewHeader, { PreviewMode } from "./PreviewHeader";

export default function PreviewAccueilAware() {
  const [mode, setMode] = useState<PreviewMode>("visitor");
  const [parentsEnabled, setParentsEnabled] = useState(false);

  const isStudent = mode === "student";

  // Données fictives pour le mini-dashboard
  const fakeProfile = {
    name: "Compte démo",
    grade: "4ᵉ",
    theme: "Mario & Dragon Ball Z",
    subjects: ["Physique-Chimie", "Maths"],
    xpCurrent: 1200,
    xpNext: 2000,
    currentChapter: "Mouvements et vitesses",
    weeklySessions: 4,
    weeklyGoal: 5,
  };

  const xpRatio = Math.min(
    100,
    Math.round((fakeProfile.xpCurrent / fakeProfile.xpNext) * 100),
  );
  const weeklyRatio = Math.min(
    100,
    Math.round((fakeProfile.weeklySessions / fakeProfile.weeklyGoal) * 100),
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Barre de navigation simulée */}
      <PreviewHeader mode={mode} />

      <main className="flex-1">
        {/* Barre de réglages de prévisualisation */}
        <section className="border-b border-slate-200 bg-white/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Mode prévisualisation
              </p>
              <p className="text-xs text-slate-500">
                Ici on simule l’état connecté / non connecté et l’option
                parents, sans toucher à la vraie page d’accueil.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex items-center gap-2 rounded-full bg-transparent ui-border bg-white px-1 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("visitor")}
                  className={`rounded-full px-3 py-1 ${
                    mode === "visitor"
                      ? "bg-slate-50 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Visiteur (non connecté)
                </button>
                <button
                  type="button"
                  onClick={() => setMode("student")}
                  className={`rounded-full px-3 py-1 ${
                    mode === "student"
                      ? "bg-emerald-500 text-slate-950 font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Élève connecté
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-500 bg-white"
                  checked={parentsEnabled}
                  onChange={(e) => setParentsEnabled(e.target.checked)}
                />
                <span>
                  Espace parents{" "}
                  <span className="font-semibold">
                    {parentsEnabled ? "acheté" : "non acheté"}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* HERO + éventuellement mini-dashboard */}
        <section className="border-b border-slate-200 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/95">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-10 pt-8 md:flex-row md:items-start md:justify-between">
            {/* Colonne gauche : hero */}
            <div className="max-w-xl space-y-4">
              {!isStudent && (
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <span>✨ Prévisualisation — Visiteur</span>
                  <span className="hidden text-emerald-300 md:inline">
                    (essai gratuit mis en avant)
                  </span>
                </p>
              )}
              {isStudent && (
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                  <span>✅ Prévisualisation — Élève connecté</span>
                  <span className="hidden text-sky-300 md:inline">
                    (dashboard + reprise de progression)
                  </span>
                </p>
              )}

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {isStudent
                  ? "Continue ton aventure scientifique là où tu t’es arrêté"
                  : "Apprendre les sciences comme dans tes jeux vidéo"}
              </h1>

              <p className="text-sm text-slate-600 sm:text-base">
                {isStudent ? (
                  <>
                    Retrouve tes chapitres en cours, ta barre d’XP et tes défis
                    du moment en un coup d’œil. Le contenu s’adapte à ton
                    niveau et à tes thèmes (Mario, One Piece, Dragon Ball Z…).
                  </>
                ) : (
                  <>
                    Le site s’adapte à ton niveau (collège / lycée) et à ta
                    matière. Tu peux tester gratuitement un parcours guidé, puis
                    débloquer des chapitres complets, des badges et des thèmes
                    visuels.
                  </>
                )}
              </p>

              {!isStudent && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="/login"
                    className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-700"
                  >
                    Commencer l’essai gratuit
                  </a>
                  <a
                    href="/tarifs"
                    className="inline-flex items-center rounded-full border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white"
                  >
                    Voir les formules
                  </a>
                  <p className="text-xs text-slate-500">
                    Aucun engagement, annulation possible à tout moment.
                  </p>
                </div>
              )}

              {isStudent && (
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p>
                    Classe simulée : <strong>{fakeProfile.grade}</strong> ·
                    Thèmes : <strong>{fakeProfile.theme}</strong>
                  </p>
                  <p>
                    Matières actives :{" "}
                    <strong>{fakeProfile.subjects.join(", ")}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Colonne droite : mini-dashboard si élève connecté */}
            {isStudent && (
              <aside className="w-full max-w-md space-y-4 rounded-2xl ui-card/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Profil</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {fakeProfile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {fakeProfile.grade} •{" "}
                      {fakeProfile.subjects.join(" + ")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-800 px-3 py-2 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                      Niveau perso
                    </p>
                    <p className="text-sm font-semibold text-emerald-300">
                      Saiyan niv. 1
                    </p>
                    <p className="text-[10px] text-slate-500">
                      (exemple : Dragon Ball Z)
                    </p>
                  </div>
                </div>

                {/* Barre d’XP */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      XP progression
                    </span>
                    <span className="text-slate-500">
                      {fakeProfile.xpCurrent} / {fakeProfile.xpNext}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${xpRatio}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Encore{" "}
                    <span className="font-semibold text-emerald-300">
                      {fakeProfile.xpNext - fakeProfile.xpCurrent} XP
                    </span>{" "}
                    pour débloquer l’évolution suivante du personnage.
                  </p>
                </div>

                {/* Chapitre en cours */}
                <div className="rounded-xl ui-card px-3 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Chapitre en cours
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {fakeProfile.currentChapter}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Reprendre la série d’exercices là où tu t’es arrêté
                    (tutoriel + entraînement + défi).
                  </p>
                  <div className="mt-2 flex gap-2">
                    <a
                      href="#"
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-emerald-700"
                    >
                      Reprendre
                    </a>
                    <a
                      href="/compte"
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-transparent ui-border px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-white"
                    >
                      Voir ma progression
                    </a>
                  </div>
                </div>

                {/* Objectif hebdo */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      Sessions cette semaine
                    </span>
                    <span className="text-slate-500">
                      {fakeProfile.weeklySessions} / {fakeProfile.weeklyGoal}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-sky-400"
                      style={{ width: `${weeklyRatio}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Objectif :{" "}
                    <span className="font-semibold text-sky-300">
                      {fakeProfile.weeklyGoal} sessions
                    </span>{" "}
                    par semaine pour garder un bon rythme.
                  </p>
                </div>
              </aside>
            )}
          </div>
        </section>

        {/* SECTION : blocs “tutoriels, entraînement, multijoueur…” */}
        <section className="border-b border-slate-200 bg-white/95">
          <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {isStudent
                  ? "Comment se déroule une séance type ?"
                  : "Ce que tu trouves dans Site Sciences"}
              </h2>
              <p className="text-xs text-slate-500">
                Cette section reprend la structure de ta page d’accueil (6
                encarts : tutoriels, entraînement, multi-joueur live, etc.).
              </p>
            </div>

            {/* Grille 6 encarts */}
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                title="Tutoriels guidés"
                badge="Pas-à-pas"
                desc="Une explication claire, avec des exemples concrets inspirés de tes univers (Mario, One Piece, Dragon Ball Z…)."
              />
              <FeatureCard
                title="Entraînement solo"
                badge="XP + badges"
                desc="Des exercices progressifs, avec correction immédiate et montée en XP pour ton personnage."
              />
              <FeatureCard
                title="Multijoueur live"
                badge="À venir"
                desc="Des défis en direct avec d’autres élèves, pour réviser un chapitre en mode versus."
              />
              <FeatureCard
                title="Défis chronométrés"
                badge="Challenge"
                desc="Des séries de questions rapides pour vérifier que le chapitre est maîtrisé."
              />
              <FeatureCard
                title="Mode focus"
                badge="Concentration"
                desc="Interface épurée, sans distraction, idéale pour les élèves TDAH ou facilement distraits."
              />
              <FeatureCard
                title="Révisions intelligentes"
                badge="Smart recap"
                desc="Le site propose automatiquement les chapitres à revoir en priorité selon tes erreurs."
              />
            </div>
          </div>
        </section>

        {/* SECTION : Teaser Espace parents */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-6">
            <div className="rounded-2xl border border-emerald-700/50 bg-emerald-900/20 px-6 py-6 sm:px-8 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="max-w-xl">
                <p className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  👨‍👩‍👧 Espace parents — prévisualisation
                </p>
                <h2 className="mt-3 text-xl font-semibold text-emerald-50 sm:text-2xl">
                  {parentsEnabled
                    ? "Votre espace parents est activé"
                    : "Suivre les progrès sans être derrière l’écran"}
                </h2>
                <p className="mt-2 text-sm text-emerald-100/80">
                  {parentsEnabled ? (
                    <>
                      Dans la vraie version, cette zone affichera un raccourci
                      clair vers l’onglet Parents du compte, avec le détail des
                      temps de travail, chapitres terminés et priorités de
                      révision.
                    </>
                  ) : (
                    <>
                      Quand l’option est activée, les parents voient un tableau
                      de bord clair : temps de travail hebdomadaire, chapitres
                      terminés, priorités de révision, et modes activés (TDAH,
                      DYS, TSA, HPI).
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <ul className="space-y-1 text-sm text-emerald-100/80">
                  <li>• Progression par matière, niveau et chapitre</li>
                  <li>• Temps de travail hebdomadaire et régularité</li>
                  <li>• Modes d’apprentissage et thèmes visuels actifs</li>
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  {parentsEnabled ? (
                    <>
                      <a
                        href="/compte?onglet=parents"
                        className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
                      >
                        Prévisualiser l’onglet Parents
                      </a>
                      <span className="text-xs text-emerald-100/80">
                        (dans la vraie app, ce bouton mènera directement au
                        tableau de bord parents)
                      </span>
                    </>
                  ) : (
                    <>
                      <a
                        href="/tarifs"
                        className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-700"
                      >
                        Voir les formules avec suivi parents
                      </a>
                      <a
                        href="/faq"
                        className="text-xs underline underline-offset-4 text-emerald-100/80 hover:text-emerald-50"
                      >
                        En savoir plus
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION : Nouveautés / mises à jour */}
        <section className="bg-white pb-12 pt-6">
          <div className="mx-auto max-w-6xl px-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Nouveautés (exemple de section actualités)
              </h2>
              <p className="text-xs text-slate-500">
                Ici tu pourras lister les nouveaux thèmes, chapitres ou
                fonctionnalités.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <NewsCard
                tag="Nouveau thème"
                title="Dragon Ball Z — Parcours mécanique & énergie"
                desc="Débloque des évolutions pour ton personnage en terminant chaque bloc de chapitres."
              />
              <NewsCard
                tag="Mise à jour"
                title="Mode TDAH amélioré"
                desc="Interface plus épurée, séances découpées en petits blocs avec minuteur intégré."
              />
              <NewsCard
                tag="Bientôt"
                title="Défis multi-joueurs"
                desc="Tournois hebdomadaires sur les lois de Newton et l’électricité."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* Petits composants de carte pour éviter de tout répéter */
function FeatureCard({
  title,
  badge,
  desc,
}: {
  title: string;
  badge: string;
  desc: string;
}) {
  return (
    <article className="flex flex-col rounded-2xl ui-card/70 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-500 flex-1">{desc}</p>
    </article>
  );
}

function NewsCard({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <article className="flex flex-col rounded-2xl ui-card/70 p-4">
      <span className="mb-1 inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        {tag}
      </span>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 flex-1">{desc}</p>
      <p className="mt-2 text-[11px] text-slate-9000">
        (Zone purement illustrative pour la preview.)
      </p>
    </article>
  );
}
