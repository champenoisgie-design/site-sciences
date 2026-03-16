// PATCH_TAG_MODES_CLASSIQUE_PANIER_V3
"use client";
import { CartState } from "../PanierTabs";
const MODES: Array<keyof CartState["modes"]> = ["Dyscalculie","Dysgraphie","Dyslexie","Dyspraxie","HPI","TDAH","TSA"];

export default function ModesTab({ value, onChange }: { value: CartState; onChange: (v: CartState) => void }) {
  const toggle = (k: keyof CartState["modes"]) =>
    onChange({ ...value, modes: { ...value.modes, [k]: !value.modes[k] } });

  return (
    <div className="space-y-3">
      <p className="text-gray-700">Les <strong>modes complémentaires</strong> s’appliquent à toutes vos matières.</p>
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => toggle(m)}
            className={[
              "px-3 py-2 rounded-lg border",
              value.modes[m]
                ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                : "bg-white border-gray-300 hover:bg-gray-50"
            ].join(" ")}
          >
            {m}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">Exemples à venir : Focus, pas-à-pas, etc.</p>
    </div>
  );
}
