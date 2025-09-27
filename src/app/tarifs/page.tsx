"use client";
import SubscribeButton from '@/components/SubscribeButton';
import { useEffect, useMemo, useState } from 'react';
import { gradesBySchool } from '@/lib/school';
import type { School, AnyGrade } from '@/lib/school';
import { perSubjectPricing, pack3Subjects, tierBenefits, Tier } from '@/lib/pricing';

const TIERS: Tier[] = ['Normal', 'Gold', 'Platine'];

function tierToPlan(t: Tier): 'BRONZE' | 'GOLD' | 'PLATINE' {
  if (t === 'Gold') return 'GOLD';
  if (t === 'Platine') return 'PLATINE';
  return 'BRONZE';
}

type Entitlement = {
  id: string;
  status: string;
  plan?: 'BRONZE' | 'GOLD' | 'PLATINE';
  kind: 'SUBJECT' | 'PACK3';
  subject?: string;
  grade?: string;
};

export default function Page() {
  const [school, setSchool] = useState<School | undefined>();
  const [grade, setGrade] = useState<AnyGrade | undefined>();
  const [tier, setTier] = useState<Tier>('Normal');

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);

  // Clés actives pour désactiver les boutons : `${grade}:${tier}:${subject}` et `${grade}:${tier}:PACK3`
  const activeKeys = useMemo(() => {
    const s = new Set<string>();
    for (const e of entitlements) {
      if (e.kind === 'PACK3' && e.grade) {
        s.add(`${e.grade}:${e.plan}:PACK3`);
      } else if (e.kind === 'SUBJECT' && e.grade && e.subject) {
        s.add(`${e.grade}:${e.plan}:${e.subject}`);
      }
    }
    return s;
  }, [entitlements]);

  const grades = useMemo(() => (school ? gradesBySchool[school] : []), [school]);
  const perSubj = useMemo(() => (grade ? perSubjectPricing(grade, tier) : []), [grade, tier]);
  const pack = useMemo(() => (grade ? pack3Subjects(grade, tier) : null), [grade, tier]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingStatus(true);
        const r = await fetch('/api/billing/status');
        if (!r.ok) return; // non connecté ou pas d'abonnement
        const data = await r.json();
        setEntitlements(data?.entitlements ?? []);
      } finally {
        setLoadingStatus(false);
      }
    })();
  }, []);

  const plan = tierToPlan(tier);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Tarifs</h1>

      {/* Sélecteurs École / Niveau / Palier */}
      <div className="mb-6 grid gap-4 rounded-2xl border p-4">
        {/* École */}
        <div>
          <label className="mb-1 block text-sm font-medium">École</label>
          <div className="flex gap-2">
            {(['college', 'lycee'] as School[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSchool(s);
                  setGrade(undefined);
                }}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  school === s
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {s === 'college' ? 'Collège' : 'Lycée'}
              </button>
            ))}
          </div>
        </div>

        {/* Niveau */}
        <div>
          <label className="mb-1 block text-sm font-medium">Niveau</label>
          <div className="flex flex-wrap gap-2">
            {grades.length === 0 && (
              <span className="text-xs text-zinc-500">Choisis d’abord Collège ou Lycée</span>
            )}
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  grade === g
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Palier d'abonnement */}
        <div>
          <label className="mb-1 block text-sm font-medium">Niveau d’abonnement</label>
          <div className="flex flex-wrap gap-2">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  tier === t
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <ul className="mt-2 list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-400">
            {tierBenefits[tier].map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grille de prix par matière */}
      {grade ? (
        <div className="grid gap-4 md:grid-cols-3">
          {perSubj.map((t) => {
            const key = `${grade}:${plan}:${t.subject}`;
            const isActive = activeKeys.has(key);
            return (
              <div key={t.subject} className="rounded-2xl border p-5">
                <h2 className="text-lg font-semibold">{t.subject}</h2>
                <p className="mt-2 text-2xl font-bold">{t.price} € / mois</p>
                <ul className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {tierBenefits[tier].map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>

                {isActive ? (
                  <span className="mt-4 inline-block rounded-lg border px-3 py-1.5 text-sm">
                    ✅ Déjà abonné
                  </span>
                ) : (
                  <SubscribeButton
                    plan={plan}
                    kind="SUBJECT"
                    subject={t.subject}
                    grade={String(grade)}
                    label="S'abonner"
                    disabled={loadingStatus}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Choisis un niveau pour afficher les prix par matière.</p>
      )}

      {/* Pack 3 matières, disponible pour toutes les classes */}
      {grade && pack && (
        <div className="mt-6 rounded-2xl border p-5">
          <div className="mb-1 w-fit rounded-full bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
            Pack 3 matières — {grade} — {tier}
          </div>
          <p className="text-lg">
            Prix pack: <span className="font-semibold">{pack.packPrice} € / mois</span>
            {pack.saved > 0 && (
              <span className="text-green-600 dark:text-green-400"> (économie ~{pack.saved} €)</span>
            )}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Remise ~20% sur la somme des 3 matières du même niveau et palier.
          </p>

          {activeKeys.has(`${grade}:${plan}:PACK3`) ? (
            <span className="mt-3 inline-block rounded-lg border px-3 py-1.5 text-sm">✅ Déjà abonné</span>
          ) : (
            <SubscribeButton
              plan={plan}
              kind="PACK3"
              grade={String(grade)}
              packPrice={pack.packPrice}
              label="S'abonner au pack 3 matières"
              disabled={loadingStatus}
            />
          )}
        </div>
      )}

      {/* Offre Famille (info) */}
      <div className="mt-6 rounded-2xl border p-5">
        <div className="mb-1 w-fit rounded-full bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
          Offre Famille
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Plusieurs niveaux au foyer (ex: 6e + Terminale) : remise progressive sur le total. Contacte-nous pour un devis « multi-niveaux » nominatif.
        </p>
        <a
          href="/contact"
          className="mt-3 inline-block rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Demander un devis Famille
        </a>
      </div>
    </section>
  );
}
