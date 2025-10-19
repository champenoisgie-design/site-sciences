'use client'
import Link from 'next/link'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'

const EUR = '€'
const P_MODE = Number(process.env.NEXT_PUBLIC_PRICE_EUR_MODE ?? 0)

type Props = { entModes: string[] }
type ModeKey = 'tdah' | 'dys' | 'tsa' | 'hpi'

const MODES: Array<{
  key: ModeKey
  title: string
  points: string[]
  example: string
  cta: string
}> = [
  {
    key: 'tdah',
    title: 'Mode TDAH',
    points: [
      'Interface aérée, étapes courtes (chunking) + petite minuterie.',
      'Réduction des distracteurs (éléments non essentiels masqués).',
      'Objectifs micro-validants + feedback immédiat (dopamine-friendly).',
    ],
    example:
      'Un exercice est découpé en micro-étapes avec un indicateur de progression clair (1/5, 2/5…).',
    cta: 'Activer ce mode — ',
  },
  {
    key: 'dys',
    title: 'Mode DYS',
    points: [
      'Police adaptée, interlignage/espacement accrus, contrastes doux.',
      'Consignes reformulées + pictogrammes (phrases courtes).',
      'Lecture audio des énoncés et mise en évidence des mots importants.',
    ],
    example:
      'Les mots complexes sont surlignés et peuvent être lus à voix haute en un clic.',
    cta: 'Activer ce mode — ',
  },
  {
    key: 'tsa',
    title: 'Mode TSA',
    points: [
      'Prévisibilité : plan clair en haut de la page, pas de changement brutal.',
      'Contrôles sensoriels (sons/animations off par défaut), thèmes calmes.',
      'Guides visuels récurrents (mêmes icônes, mêmes motifs) pour ancrer les repères.',
    ],
    example:
      'Un bandeau « Aujourd’hui » résume les 3 tâches avec cases à cocher.',
    cta: 'Activer ce mode — ',
  },
  {
    key: 'hpi',
    title: 'Mode HPI',
    points: [
      'Accès à des défis avancés + chemins accélérés.',
      'Explications condensées avec liens d’approfondissement (optionnels).',
      'Tableau de bord ambitieux, badges élite.',
    ],
    example:
      'Un bouton « Challenge » propose une variante plus abstraite de l’exercice.',
    cta: 'Activer ce mode — ',
  },
]

function price(n: number) {
  return n ? `${n.toFixed(2)} ${EUR}` : '—'
}

/** CONTENUS DE DEMO (avant vs mode) **/
function DemoPanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="demo2-panel">
      <div className="demo2-title">{title}</div>
      <div className="demo2-card">{children}</div>
    </div>
  )
}

function DemoTDAH() {
  return (
    <div className="demo2-grid">
      <DemoPanel title="Avant (interface classique)">
        <p>
          Exercice : <strong>Énergie cinétique</strong>
        </p>
        <p>
          Énoncé sur un long bloc de texte, éléments décoratifs visibles, aucune
          indication d’étape.
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li>Aucune minuterie</li>
          <li>Beaucoup d’éléments concurrents</li>
        </ul>
      </DemoPanel>
      <DemoPanel title="Mode TDAH (chunking + timer)">
        <div className="chip-row">
          <span className="chip">Étape 1/5</span>
          <span className="chip">00:25</span>
        </div>
        <p className="mb-2">
          Lis l’énoncé en 20 secondes. Les éléments secondaires sont masqués.
        </p>
        <div className="progress">
          <span style={{ width: '20%' }} />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Mini-récompenses visuelles à chaque étape complétée 🎉
        </p>
      </DemoPanel>
    </div>
  )
}

function DemoDYS() {
  return (
    <div className="demo2-grid">
      <DemoPanel title="Avant (texte dense)">
        <p className="text-sm">
          « La première loi de Newton indique qu’un corps conserve son état si
          la somme des forces est nulle… »
        </p>
      </DemoPanel>
      <DemoPanel title="Mode DYS (espacement + syllabation)">
        <p className="dys-text">
          La <span className="dys-strong">pre·mière</span> loi (inertie) : un
          corps conserve son état de repos ou de{' '}
          <span className="dys-strong">mou·ve·ment</span> recti·li·gne
          uni·for·me si la somme des forces est nulle.
        </p>
        <div className="demo2-actions">
          <button className="btn-outline">🔊 Lire à voix haute</button>
          <button className="btn-outline">Syllabation ✔</button>
          <button className="btn-outline">Mots-clés ✔</button>
        </div>
      </DemoPanel>
    </div>
  )
}

function DemoTSA() {
  return (
    <div className="demo2-grid">
      <DemoPanel title="Avant (navigation changeante)">
        <p>Les boutons et encarts changent de place selon les pages.</p>
      </DemoPanel>
      <DemoPanel title="Mode TSA (prévisible & calme)">
        <div className="plan">
          <div className="plan-title">Plan d’aujourd’hui</div>
          {['Lire l’énoncé', 'Faire 3 questions', 'Valider et revoir'].map(
            (t, i) => (
              <label key={i} className="plan-item">
                <input type="checkbox" /> {t}
              </label>
            ),
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Mêmes repères, pas d’animations brusques, thème adouci.
        </p>
      </DemoPanel>
    </div>
  )
}

function DemoHPI() {
  return (
    <div className="demo2-grid">
      <DemoPanel title="Avant (explications longues)">
        <p>Paragraphe théorique verbeux et sans niveaux de lecture.</p>
      </DemoPanel>
      <DemoPanel title="Mode HPI (condensé + challenge)">
        <p className="text-sm">
          <strong>Condensé :</strong> si f est dérivable en a, alors{' '}
          <code>lim(x→a)[(f(x)-f(a))/(x-a)] = f’(a)</code>.
        </p>
        <div className="demo2-actions">
          <button className="btn-outline">🔬 Challenge</button>
          <button className="btn-outline">↗ Approfondir</button>
        </div>
      </DemoPanel>
    </div>
  )
}

function DemoFor({ mode }: { mode: ModeKey }) {
  if (mode === 'tdah') return <DemoTDAH />
  if (mode === 'dys') return <DemoDYS />
  if (mode === 'tsa') return <DemoTSA />
  return <DemoHPI />
}

export default function ModesClient({ entModes }: Props) {
  const [modal, setModal] = useState<null | ModeKey>(null)

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Modes d’apprentissage</h2>
      <p className="text-sm text-gray-600 mb-2">
        Le mode <strong>Normal</strong> est inclus gratuitement pour tous.
      </p>
      <div className="grid lg:grid-cols-2 gap-3">
        {MODES.map((m) => {
          const has = entModes.includes(m.key)
          return (
            <div key={m.key} className="border rounded p-4">
              <div className="font-semibold">{m.title}</div>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                {m.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <em>Exemple :</em> {m.example}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 items-center">
                {has ? (
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    Déjà inclus
                  </span>
                ) : (
                  <Link
                    href={`/api/checkout?tab=modes&mode=${m.key}`}
                    className="text-sm underline"
                  >
                    {m.cta}
                    {price(P_MODE)}/mois
                  </Link>
                )}
                <button
                  className="text-sm btn-accent"
                  onClick={() => setModal(m.key)}
                >
                  Voir un exemple
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal plein écran */}
      <Modal
        open={modal !== null}
        title={modal ? MODES.find((x) => x.key === modal)?.title : undefined}
        onClose={() => setModal(null)}
      >
        {modal && (
          <>
            <DemoFor mode={modal} />
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-gray-600">
                Cette prévisualisation illustre l’adaptation concrète des cours,
                exercices et consignes.
              </p>
              <Link
                href={`/tarifs/mode-d-apprentissage/${modal}`}
                className="btn-cta"
              >
                Aller à l’offre {price(P_MODE)}/mois
              </Link>
            </div>
          </>
        )}
      </Modal>

      <p className="text-xs text-gray-500 mt-3">
        Conseil : commencez par le mode qui vous ressemble le plus — vous
        pourrez en changer à tout moment.
      </p>
    </div>
  )
}
