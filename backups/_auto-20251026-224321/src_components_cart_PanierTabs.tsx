"use client";
import { useMemo, useState } from "react";
import SubjectsTab from "./tabs/SubjectsTab";
import ThemesTab from "./tabs/ThemesTab";
import ModesTab from "./tabs/ModesTab";
import ChaptersTab from "./tabs/ChaptersTab";
import SummaryBar from "./SummaryBar";

export type CartState = {
  subjects: Array<{ niveau: string; matiere: string }>;
  modes: { TDAH: boolean; DYS: boolean; TSA: boolean; HPI: boolean };
  plan: "Normal" | "Gold" | "Platine";
  period: "Mensuel" | "Annuel";
};

const TABS = [
  { id: "subjects", label: "Matières par niveau" },
  { id: "themes",   label: "Thèmes visuels (demo)" },
  { id: "modes",    label: "Modes d’apprentissage" },
  { id: "chapters", label: "Achat par chapitre" },
] as const;

export default function PanierTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("subjects");
  const [state, setState] = useState<CartState>({
    subjects: [{ niveau: "4e", matiere: "Physique-Chimie" }],
    modes: { TDAH: false, DYS: false, TSA: false, HPI: false },
    plan: "Gold",
    period: "Mensuel",
  });

  const subjectsCount = state.subjects.length;

  const addonsCount = useMemo(
    () => Object.values(state.modes).filter(Boolean).length,
    [state.modes]
  );

  const distinctLevelsCount = useMemo(
    () => new Set(state.subjects.map(s => s.niveau)).size,
    [state.subjects]
  );

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex gap-2 rounded-xl bg-white p-1 border border-gray-200 w-full overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={[
              "px-4 py-2 text-sm rounded-lg whitespace-nowrap",
              active === t.id ? "bg-gray-900 text-white" : "hover:bg-gray-100"
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panneaux */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
        {active === "subjects" && (
          <SubjectsTab value={state} onChange={setState} />
        )}
        {active === "themes" && (
          <ThemesTab value={state} onChange={setState} />
        )}
        {active === "modes" && (
          <ModesTab value={state} onChange={setState} />
        )}
        {active === "chapters" && (
          <ChaptersTab value={state} onChange={setState} />
        )}
      </div>

      {/* Résumé + Total serveur */}
      <SummaryBar
        subjectsCount={subjectsCount}
        addonsCount={addonsCount}
        distinctLevelsCount={distinctLevelsCount}
        plan={state.plan}
        period={state.period}
        onPlanChange={(plan) => setState((s) => ({ ...s, plan }))}
        onPeriodChange={(period) => setState((s) => ({ ...s, period }))}
      />
    </div>
  );
}
