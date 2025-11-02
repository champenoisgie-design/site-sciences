"use client";
import { CartState } from "../PanierTabs";
const CHAPITRES = [
  { id: "pc4e-circuits",  label: "PC 4e — Circuits simples", price: "2,99 €" },
  { id: "pc4e-intensite", label: "PC 4e — Intensité & Tension", price: "2,99 €" },
  { id: "maths1-deriv",   label: "Maths 1re — Dérivées", price: "2,99 €" },
];

export default function ChaptersTab({
  value, onChange
}: { value: CartState; onChange: (v: CartState) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-gray-700">Acheter un <strong>chapitre à l’unité</strong>.</p>
      <ul className="grid gap-2">
        {CHAPITRES.map((c) => (
          <li key={c.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{c.label}</div>
              <div className="text-sm text-gray-600">Licence personnelle • Mises à jour incluses</div>
            </div>
            <div className="text-gray-800">{c.price}</div>
            <button
              className="px-3 py-1 rounded-lg bg-gray-900 text-white hover:bg-black"
              onClick={() => alert("Ajouté au panier (démo)")}
            >
              Ajouter
            </button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-600">Remise pack auto si 3 chapitres ou +</p>
    </div>
  );
}
