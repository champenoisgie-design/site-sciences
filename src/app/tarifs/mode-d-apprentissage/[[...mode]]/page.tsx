import { use } from 'react'
import { MODE_LABELS, PRICING, centsToEuros } from '@/config/pricing'
import { notFound } from 'next/navigation'
// PATCH_TAG_MODES_DYS_REMOVAL_V1

type ModeKey = keyof typeof MODE_LABELS

function examplesFor(mode: ModeKey) {
  switch (mode) {
    case 'dyslexie':
      return [
        {
          title: "Lecture accompagnée",
          points: [
            "Texte aéré avec repères visuels stables.",
            "Surlignage progressif phrase par phrase.",
            "Lecture audio optionnelle (si activée).",
          ],
        },
        {
          title: "Dictée intelligente",
          points: [
            "Segmentation en syllabes (option).",
            "Correction visuelle claire et douce.",
            "Aide à la relecture sans surcharge.",
          ],
        },
        {
          title: "Compréhension de texte",
          points: [
            "Paragraphes courts et structurés.",
            "Questions directes, une à une.",
            "Mots-clés mis en évidence.",
          ],
        },
      ]
    case 'dyscalculie':
      return [
        {
          title: "Addition fractionnée",
          points: [
            "Décomposition en étapes visibles.",
            "Une opération à la fois.",
            "Validation étape par étape.",
          ],
        },
        {
          title: "Problème guidé",
          points: [
            "Données mises en évidence.",
            "Résolution en 3 étapes maximum.",
            "Méthode rappelée au bon moment.",
          ],
        },
        {
          title: "Géométrie visuelle",
          points: [
            "Figures lisibles et stables.",
            "Mesures affichées clairement.",
            "Manipulation avant réponse.",
          ],
        },
      ]
    case 'dyspraxie':
      return [
        {
          title: "Exercice structuré",
          points: [
            "Une consigne à la fois.",
            "Boutons larges et espacés.",
            "Confirmation visuelle avant validation.",
          ],
        },
        {
          title: "Organisation guidée",
          points: [
            "Étapes numérotées simples.",
            "Cases à cocher pour suivre l’avancement.",
            "Retour facile en arrière.",
          ],
        },
        {
          title: "Géométrie assistée",
          points: [
            "Schémas fixes et lisibles.",
            "Moins de manipulation fine requise.",
            "Aide visuelle continue.",
          ],
        },
      ]
    case 'dysgraphie':
      return [
        {
          title: "Rédaction assistée",
          points: [
            "Plan simple proposé (début / milieu / fin).",
            "Mots de liaison suggérés.",
            "Aide à la relecture sans jugement.",
          ],
        },
        {
          title: "Réponse courte guidée",
          points: [
            "Phrase à compléter (option).",
            "Mots-clés proposés.",
            "Validation progressive.",
          ],
        },
        {
          title: "Résumé structuré",
          points: [
            "Mots importants identifiés.",
            "Cadre de réponse prédéfini.",
            "Aide à prioriser les idées.",
          ],
        },
      ]
    case 'tdah':
      return [
        {
          title: 'Pas à pas chronométré',
          points: [
            'Consignes 1/4, 2/4… avec barre de progression.',
            'Minuteur facultatif (3–5 min) par étape.',
            'Notification douce quand il reste 30 secondes.',
          ],
        },
        {
          title: 'Révision rapide — cartes',
          points: [
            'Séries de 6 cartes maximum.',
            'Alternance question/réponse avec grosse typographie.',
            'Bouton “j’ai compris / à revoir” pour trier.',
          ],
        },
        {
          title: 'Physique — pendule simple',
          points: [
            'Vidéo courte (≤45s) → schéma fixe → 3 QCM.',
            'Un seul concept par écran (T, L, g).',
            'Rappel des unités et ordre de grandeur.',
          ],
        },
      ]
    case 'tsa':
      return [
        {
          title: 'Prévisibilité de la séance',
          points: [
            'Sommaire visible en haut (étapes cochables).',
            'Transitions explicites entre activités.',
            'Bouton “répéter l’exemple” qui rejoue la démo.',
          ],
        },
        {
          title: 'Vocabulaire structuré',
          points: [
            'Glossaire latéral avec pictogrammes.',
            'Définitions courtes, exemples concrets.',
            'Même code couleur utilisé partout.',
          ],
        },
        {
          title: 'Chimie — réactions',
          points: [
            'Animations sobres pour montrer les échanges.',
            'QCM avec une seule variable à la fois.',
            'Feedback neutre et constant.',
          ],
        },
      ]
    case 'hpi':
      return [
        {
          title: 'Extensions de difficulté',
          points: [
            'Problème de base → variante + contrainte.',
            'Lien vers ressource avancée après réussite.',
            'Temps estimé et niveau affichés.',
          ],
        },
        {
          title: 'Maths — optimisation',
          points: [
            'Défi optionnel avec borne supérieure à trouver.',
            'Pistes au lieu de correction directe.',
            'Comparaison de stratégies (tableau final).',
          ],
        },
        {
          title: 'SVT — modélisation',
          points: [
            'Simulation paramétrable (2–3 sliders max).',
            'Question d’anticipation puis observation.',
            'Trace écrite automatique à la fin.',
          ],
        },
      ]
    default:
      return []
  }
}

export default function ModePage({
  params,
}: {
  params: { mode?: string[] } | Promise<{ mode?: string[] }>
}) {
  // PATCH_TAG_FIX_MODES_V1
  const resolved = (params as any)?.then
    ? use(params as Promise<{ mode?: string[] }>)
    : (params as { mode?: string[] } | undefined)

  const rawSlug = resolved?.mode?.[0]?.toLowerCase()

  // Sans slug => page liste des modes
  if (!rawSlug) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4" data-testid="mode-page-title">
          Modes d’apprentissage
        </h1>
        <p className="text-sm opacity-70 mb-6">
          Choisissez un mode adapté à votre profil.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.keys(MODE_LABELS).map((k) => (
            <li key={k} className="rounded-2xl border p-4">
              <a
                className="font-semibold underline"
                href={`/tarifs/mode-d-apprentissage/${k}`}
              >
                {MODE_LABELS[k as ModeKey]}
              </a>
              <p className="text-xs opacity-70">
                Dès {centsToEuros(PRICING.modes[k as keyof typeof PRICING.modes])}
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const raw = rawSlug as ModeKey

  // Slug inconnu => 404
  if (!MODE_LABELS[raw] || PRICING.modes[raw as keyof typeof PRICING.modes] == null) {
    notFound()
  }

  const label = MODE_LABELS[raw]
  const price = PRICING.modes[raw as keyof typeof PRICING.modes]
  const examples = examplesFor(raw)

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold" data-testid="mode-page-title">
          Mode {label}
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
          <span>À partir de</span>
          <strong>{centsToEuros(price)}</strong>
        </div>
        <p className="mt-3 text-sm opacity-70">
          Conçu pour améliorer le confort d’apprentissage et la compréhension.
        </p>
      </header>

      {/* Points clés */}
      <section className="mb-8 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold mb-1">Confort de lecture</h3>
          <p className="text-sm opacity-80">
            Typographies adaptées, repères visuels cohérents, densité maîtrisée.
          </p>
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold mb-1">Rythme adapté</h3>
          <p className="text-sm opacity-80">
            Consignes découpées, pas à pas guidé, feedback immédiat.
          </p>
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-semibold mb-1">Aide contextuelle</h3>
          <p className="text-sm opacity-80">
            Exemples ciblés, rappels de notions, glossaire rapide.
          </p>
        </div>
      </section>

      {/* Exemples concrets */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Exemples concrets</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {examples.map((ex, i) => (
            <div key={i} className="rounded-2xl border p-4">
              <h4 className="font-semibold mb-2">{ex.title}</h4>
              <ul className="space-y-1 text-sm">
                {ex.points.map((p, j) => (
                  <li key={j}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ courte */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Questions fréquentes</h2>
        <details className="rounded-2xl border p-4 mb-3">
          <summary className="cursor-pointer font-medium">
            Est-ce compatible avec toutes les matières ?
          </summary>
          <p className="mt-2 text-sm opacity-80">
            Oui, le mode s’applique à l’ensemble des contenus.
          </p>
        </details>
        <details className="rounded-2xl border p-4">
          <summary className="cursor-pointer font-medium">
            Peut-on revenir au mode Normal ?
          </summary>
          <p className="mt-2 text-sm opacity-80">
            Oui, vous pouvez changer de mode à tout moment.
          </p>
        </details>
      </section>

      {/* CTA */}
      <a
        className="inline-flex items-center justify-center rounded-xl border px-5 py-2 font-medium hover:bg-black/5"
        href={`/panier?mode=${raw}`}
      >
        Activer le mode {label}
      </a>
    </article>
  )
}
