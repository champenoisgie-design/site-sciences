"use client";
import { CartState } from "../PanierTabs";
const NIVEAUX = ["6e","5e","4e","3e","2nde","1re","Terminale"];
const MATIERES = ["Maths","Physique-Chimie","SVT","Technologie"];

export default function SubjectsTab({
  value, onChange
}: { value: CartState; onChange: (v: CartState) => void }) {
  const add = () =>
    onChange({ ...value, subjects: [...value.subjects, { niveau: "2nde", matiere: "Maths" }] });
  const remove = (i: number) =>
    onChange({ ...value, subjects: value.subjects.filter((_, idx) => idx !== i) });
  const set = (i: number, key: "niveau"|"matiere", val: string) => {
    const next = value.subjects.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    onChange({ ...value, subjects: next });
  };

  return (
    <div className="space-y-6">
      {/* Choix global de la formule + durée */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div>
            <span className="text-sm text-gray-600 mr-2">Formule</span>
            <select
              value={value.plan}
              onChange={(e) => onChange({ ...value, plan: e.target.value as any })}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1"
            >
              <option>Normal</option>
              <option>Gold</option>
              <option>Platine</option>
            </select>
          </div>
          <div className="md:ml-4">
            <span className="text-sm text-gray-600 mr-2">Durée</span>
            <select
              value={value.period}
              onChange={(e) => onChange({ ...value, period: e.target.value as any })}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1"
            >
              <option>Mensuel</option>
              <option>Annuel</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-gray-700">
        Choisis <strong>niveau + matière</strong> pour chaque abonnement (ex : “Physique-Chimie 4ᵉ”).
      </p>

      <div className="grid gap-3">
        {value.subjects.map((s, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-gray-200">
            <select
              value={s.niveau}
              onChange={(e) => set(i, "niveau", e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1"
              aria-label={`Niveau ${i+1}`}
            >
              {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <select
              value={s.matiere}
              onChange={(e) => set(i, "matiere", e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1"
              aria-label={`Matière ${i+1}`}
            >
              {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <button
              className="ml-auto text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300"
              onClick={() => remove(i)}
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <button className="px-3 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-300" onClick={add}>
        + Ajouter une matière/niveau
      </button>
    </div>
  );
}
