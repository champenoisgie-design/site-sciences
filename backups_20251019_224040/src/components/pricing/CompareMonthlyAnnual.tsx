"use client";

import { useMemo, useState } from "react";
function centsToEuro(c: number) { return (c / 100).toFixed(2).replace(".", ","); }

type Plan = "normal" | "gold" | "platine";

export default function CompareMonthlyAnnual() {
  const [subjects, setSubjects] = useState(1);
  const [plan, setPlan] = useState<Plan>("normal");
  const [modes, setModes] = useState(0);

  // Barème indicatif local (n'altère pas le serveur)
  const base = 999;      // 9,99 €
  const modePlus = 299;  // +2,99 €
  const planDelta = plan === "gold" ? 500 : plan === "platine" ? 1000 : 0;
  const subjectsDiscount = subjects >= 4 ? 0.2 : subjects >= 3 ? 0.1 : 0;

  const monthly = useMemo(() => {
    const perSubject = base + planDelta + (modes * modePlus);
    const subtotal = perSubject * subjects;
    return Math.round(subtotal * (1 - subjectsDiscount));
  }, [subjects, modes, planDelta, subjectsDiscount]);

  const annual = Math.round(monthly * 12 * 0.8); // -20% sur 12 mois

  return (
    <div>
      {/* Contrôles */}
      <div className="mt-6 grid gap-4 md:grid-cols-3 max-w-3xl">
        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Matières</span>
          <input type="number" min={1} max={8} value={subjects}
                 onChange={(e)=>setSubjects(parseInt(e.target.value||"1"))}
                 className="w-24 rounded-lg border px-3 py-2"/>
        </label>
        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Modes (TDAH/DYS…)</span>
          <input type="number" min={0} max={3} value={modes}
                 onChange={(e)=>setModes(parseInt(e.target.value||"0"))}
                 className="w-24 rounded-lg border px-3 py-2"/>
        </label>
        <label className="rounded-2xl border p-4 flex items-center justify-between">
          <span>Plan</span>
          <select value={plan} onChange={(e)=>setPlan(e.target.value as Plan)}
                  className="w-40 rounded-lg border px-3 py-2">
            <option value="normal">Normal</option>
            <option value="gold">Gold (+5€)</option>
            <option value="platine">Platine (+10€)</option>
          </select>
        </label>
      </div>

      {/* Tableau comparatif */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full max-w-3xl text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3">Période</th>
              <th className="py-3">Total TTC</th>
              <th className="py-3">Détail</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-medium">Mensuel</td>
              <td className="py-3">{centsToEuro(monthly)} € / mois</td>
              <td className="py-3">Réduc matières incluse</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Annuel</td>
              <td className="py-3">{centsToEuro(annual)} € / an</td>
              <td className="py-3">−20% vs 12× mensuel</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
