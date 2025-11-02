"use client";
import { CartState } from "../PanierTabs";

const ROWS = [
  { feat: "Cours + Exercices interactifs", N: "✔︎", G: "✔︎", P: "✔︎" },
  { feat: "Fiches mémo personnalisées",    N: "—",  G: "✔︎", P: "✔︎" },
  { feat: "Tableau Parents + e-mails",     N: "—",  G: "✔︎", P: "✔︎" },
  { feat: "Support prioritaire",           N: "—",  G: "—",  P: "✔︎" },
];

export default function GoldPlatineTab({
  value, onChange
}: { value: CartState; onChange: (v: CartState) => void }) {
  return (
    <div className="space-y-4">
      <p className="opacity-80">Compare les avantages et choisis la formule.</p>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm border-separate border-spacing-y-1">
          <thead className="text-left opacity-70">
            <tr>
              <th className="py-2 px-3">Fonctionnalité</th>
              <th className="py-2 px-3">Normal</th>
              <th className="py-2 px-3">Gold</th>
              <th className="py-2 px-3">Platine</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.feat} className="bg-white/5">
                <td className="py-2 px-3">{r.feat}</td>
                <td className="py-2 px-3">{r.N}</td>
                <td className="py-2 px-3">{r.G}</td>
                <td className="py-2 px-3">{r.P}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        {(["Normal","Gold","Platine"] as const).map((p) => (
          <button key={p} onClick={() => onChange({ ...value, plan: p })}
            className={[
              "px-4 py-2 rounded-lg",
              value.plan === p ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"
            ].join(" ")}>
            Choisir {p}
          </button>
        ))}
      </div>
    </div>
  );
}
