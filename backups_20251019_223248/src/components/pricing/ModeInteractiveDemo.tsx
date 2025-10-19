'use client'
import { useMemo, useState } from 'react'

type Props = { mode: 'dys' | 'tdah' | 'tsa' | 'hpi' }

// util
const Step = ({ n, total }: { n: number; total: number }) => (
  <div className="mb-3 flex items-center gap-2 text-xs">
    <div className="h-2 w-full rounded-full bg-black/10">
      <div
        className="h-2 rounded-full bg-black/70 transition-all"
        style={{ width: `${(n / total) * 100}%` }}
      />
    </div>
    <span className="tabular-nums">
      {n}/{total}
    </span>
  </div>
)

export default function ModeInteractiveDemo({ mode }: Props) {
  // liste d'exemples (sélecteur)
  const examples = useMemo(() => {
    switch (mode) {
      case 'dys':
        return [
          { key: 'lecture', label: 'Lecture guidée d’un énoncé' },
          { key: 'accords', label: 'Accords — mise en évidence' },
        ] as const
      case 'tdah':
        return [
          { key: 'pasapas', label: 'Consignes pas à pas' },
          { key: 'cartes', label: 'Révision cartes rapides' },
        ] as const
      case 'tsa':
        return [
          { key: 'sommaire', label: 'Séance prévisible' },
          { key: 'glossaire', label: 'Glossaire pictos' },
        ] as const
      case 'hpi':
        return [
          { key: 'defi', label: 'Défi extension' },
          { key: 'comparaison', label: 'Comparer stratégies' },
        ] as const
      default:
        return [] as const
    }
  }, [mode])

  const [sel, setSel] = useState(examples[0]?.key ?? '')

  return (
    <section className="rounded-2xl border p-4 md:p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Exemple interactif</h3>
        {examples.length > 0 && (
          <select
            value={sel}
            onChange={(e) => setSel(e.target.value as any)}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            {examples.map((e) => (
              <option key={e.key} value={e.key}>
                {e.label}
              </option>
            ))}
          </select>
        )}
      </header>

      {/* Rendu par mode/exemple */}
      <div className="grid gap-4 md:grid-cols-[1.2fr,1fr]">
        {/* zone démo */}
        <div className="rounded-xl border px-4 py-3">
          {mode === 'dys' && <DemoDYS which={sel as any} />}
          {mode === 'tdah' && <DemoTDAH which={sel as any} />}
          {mode === 'tsa' && <DemoTSA which={sel as any} />}
          {mode === 'hpi' && <DemoHPI which={sel as any} />}
        </div>
        {/* zone explication */}
        <aside className="rounded-xl border px-4 py-3 text-sm opacity-80">
          <Explain mode={mode} which={sel} />
        </aside>
      </div>
    </section>
  )
}

/* ---------- DYS ---------- */
function DemoDYS({ which }: { which: 'lecture' | 'accords' }) {
  const [big, setBig] = useState(false)
  const [spacing, setSpacing] = useState(false)
  const [syll, setSyll] = useState(true)

  if (which === 'accords') {
    const [show, setShow] = useState(false)
    return (
      <div>
        <p className="text-sm mb-2">Choisissez la bonne terminaison :</p>
        <p className="mb-3">
          Les élève<span className="underline decoration-dotted">__</span>{' '}
          {/** accord */}
          {/** phrase */}
          sont arrivé<span className="underline decoration-dotted">__</span> en
          retard.
        </p>
        <div className="flex flex-wrap gap-2">
          {['s', 'nt', 'es'].map((opt) => (
            <button
              key={opt}
              onClick={() => setShow(true)}
              className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5"
            >
              {opt}
            </button>
          ))}
        </div>
        {show && (
          <p className="mt-3 rounded-lg border bg-green-50 px-3 py-2 text-xs">
            Astuce : “les élèves” → pluriel → “sont arriv<strong>és</strong>”.
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={big}
            onChange={(e) => setBig(e.target.checked)}
          />
          Grande police
        </label>
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={spacing}
            onChange={(e) => setSpacing(e.target.checked)}
          />
          Espacement augmenté
        </label>
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={syll}
            onChange={(e) => setSyll(e.target.checked)}
          />
          Syllabes repérées
        </label>
      </div>
      <p
        className="rounded-lg border p-3"
        style={{
          fontSize: big ? '1.15rem' : '1rem',
          lineHeight: spacing ? 1.9 : 1.5,
          letterSpacing: spacing ? '0.02em' : undefined,
        }}
      >
        {syll ? (
          <>
            Pro<span className="bg-yellow-100">por</span>tion
            <span className="bg-yellow-100">na</span>lité : on utilise un ta
            <span className="bg-yellow-100">bleau</span> pour pas
            <span className="bg-yellow-100">ser</span> d’une va
            <span className="bg-yellow-100">leur</span> à l’au
            <span className="bg-yellow-100">tre</span>.
          </>
        ) : (
          <>
            Proportionnalité : on utilise un tableau pour passer d’une valeur à
            l’autre.
          </>
        )}
      </p>
    </div>
  )
}

/* ---------- TDAH ---------- */
function DemoTDAH({ which }: { which: 'pasapas' | 'cartes' }) {
  const [step, setStep] = useState(1)
  const total = which === 'pasapas' ? 4 : 6

  if (which === 'cartes') {
    const [i, setI] = useState(0)
    const cards = [
      { q: 'Formule de l’aire d’un disque ?', a: 'A = π × r²' },
      { q: 'Dérivée de x²', a: '2x' },
      { q: 'Unité de g (pesanteur)', a: 'm·s⁻²' },
    ]
    const show = i % 2 === 1
    return (
      <div className="flex flex-col items-stretch">
        <Step n={(i % (cards.length * 2)) + 1} total={cards.length * 2} />
        <div className="rounded-lg border p-4 text-center">
          <p className="text-sm">
            {show ? cards[Math.floor(i / 2)].a : cards[Math.floor(i / 2)].q}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5"
            onClick={() => setI((v) => (v + 1) % (cards.length * 2))}
          >
            {show ? 'Suivant' : 'Voir la réponse'}
          </button>
          <button className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5">
            À revoir
          </button>
          <button className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5">
            Compris
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Step n={step} total={total} />
      <div className="rounded-lg border p-3 mb-3">
        {step === 1 && (
          <p className="text-sm">1) Repérer les données utiles de l’énoncé.</p>
        )}
        {step === 2 && <p className="text-sm">2) Choisir la bonne formule.</p>}
        {step === 3 && (
          <p className="text-sm">
            3) Remplacer les valeurs (unités !) dans la formule.
          </p>
        )}
        {step === 4 && (
          <p className="text-sm">
            4) Calculer et vérifier l’ordre de grandeur.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          Précédent
        </button>
        <button
          className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5"
          onClick={() => setStep((s) => Math.min(total, s + 1))}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

/* ---------- TSA ---------- */
function DemoTSA({ which }: { which: 'sommaire' | 'glossaire' }) {
  const [done, setDone] = useState([false, false, false])
  if (which === 'glossaire') {
    return (
      <div>
        <p className="text-sm mb-2">Glossaire (cliquer pour voir) :</p>
        <details className="rounded-lg border p-2 mb-2">
          <summary className="cursor-pointer">Atome</summary>
          <p className="text-xs mt-1 opacity-80">
            Constituant de base de la matière.
          </p>
        </details>
        <details className="rounded-lg border p-2">
          <summary className="cursor-pointer">Molécule</summary>
          <p className="text-xs mt-1 opacity-80">
            Ensemble d’atomes liés entre eux.
          </p>
        </details>
      </div>
    )
  }
  return (
    <div>
      <p className="text-sm mb-2">Séquence (cochez chaque étape) :</p>
      {['Observer', 'Manipuler', 'Conclure'].map((s, i) => (
        <label key={s} className="mb-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={done[i]}
            onChange={(e) =>
              setDone((d) => d.map((v, j) => (j === i ? e.target.checked : v)))
            }
          />
          <span>{s}</span>
        </label>
      ))}
    </div>
  )
}

/* ---------- HPI ---------- */
function DemoHPI({ which }: { which: 'defi' | 'comparaison' }) {
  const [ok, setOk] = useState(false)
  if (which === 'comparaison') {
    return (
      <div>
        <p className="text-sm mb-3">
          Deux méthodes donnent-elles le même résultat ?
        </p>
        <ul className="text-sm list-disc pl-4">
          <li>Méthode A : calcul direct par dérivée</li>
          <li>Méthode B : majoration/minoration</li>
        </ul>
        <p className="mt-2 text-xs opacity-70">
          → Résumer en 2 lignes la différence de démarche.
        </p>
      </div>
    )
  }
  return (
    <div>
      <p className="text-sm mb-2">
        Défi : aire maximale pour un rectangle de périmètre 40 cm ?
      </p>
      <button
        onClick={() => setOk(true)}
        className="rounded-lg border px-3 py-1 text-sm hover:bg-black/5"
      >
        Voir une piste
      </button>
      {ok && (
        <p className="mt-3 rounded-lg border bg-blue-50 px-3 py-2 text-xs">
          Piste : pour un périmètre fixé, l’aire est max quand le rectangle est
          un carré.
        </p>
      )}
    </div>
  )
}

/* ---------- Explications latérales ---------- */
function Explain({ mode, which }: { mode: Props['mode']; which: string }) {
  const base: Record<Props['mode'], string> = {
    dys: 'Texte aéré, repères constants, guidage de la lecture.',
    tdah: 'Séquençage court, objectifs visibles, feedback immédiat.',
    tsa: 'Structure stable, transitions explicites, vocabulaire clarifié.',
    hpi: 'Extensions optionnelles, résolution ouverte, métacognition.',
  }
  return (
    <div>
      <p className="mb-2">{base[mode]}</p>
      <p className="text-xs opacity-70">
        Cet aperçu est une démo simplifiée pour montrer l’intention pédagogique.
      </p>
    </div>
  )
}
