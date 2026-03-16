// PATCH_TAG_MODES_CLASSIQUE_PANIER_V3
"use client";
import type { CartItem, BillingPeriod } from "@/lib/pricing/types";
import CartIncentives from "@/components/cart/CartIncentives";
import DiscountBanners from "@/components/cart/DiscountBanners";
import { useMemo, useState, useEffect } from "react";
import SubjectsTab from "./tabs/SubjectsTab";
import ThemesTab from "./tabs/ThemesTab";
import ModesTab from "./tabs/ModesTab";
import ChaptersTab from "./tabs/ChaptersTab";
import SummaryBar from "./SummaryBar";
import { useSearchParams } from "next/navigation";

export type CartState = {
  subjects: Array<{ niveau: string; matiere: string }>;
  modes: { TDAH: boolean; Dyslexie: boolean; TSA: boolean; HPI: boolean };
  plan: "Normal" | "Gold" | "Platine";
  period: "Mensuel" | "Annuel";
};

const TABS = [
  { id: "subjects", label: "Matières par niveau" },
  { id: "themes",   label: "Thèmes visuels (demo)" },
  { id: "modes",    label: "Modes d’apprentissage" },
  { id: "chapters", label: "Achat par chapitre" },
] as const;

function __deriveCartItems(state:any): CartItem[] {
  const items: CartItem[] = [];
  const entries = Array.isArray(state?.entries) ? state.entries :
    Array.isArray(state?.subjects) ? state.subjects :
    Array.isArray(state?.lines) ? state.lines : [];
  for (const e of entries) {
    const level = (e && (e.level || e.niveau || e.grade)) || undefined;
    const title = (e && (e.subject || e.matiere || e.title)) || "Matière";
    const price = (e && typeof e.priceCents === "number") ? e.priceCents : 1299;
    items.push({ id: String(title)+"-"+(level||"NA"), type: "subject", title: String(title), level: level, priceCents: price });
  }
  const addons = Array.isArray(state?.addons) ? state.addons :
    Array.isArray(state?.modes) ? state.modes : [];
  for (const a of addons) {
    const title = (a && (a.id || a.code || a.title)) || "mode";
    const price = (a && typeof a.priceCents === "number") ? a.priceCents : 299;
    items.push({ id: "mode-"+String(title), type: "mode", title: String(title), priceCents: price });
  }
  return items;
}
export default function PanierTabs() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("subjects");
  const [state, setState] = useState<CartState>({
    subjects: [{ niveau: "4e", matiere: "Physique-Chimie" }],
    modes: { TDAH: false, Dyslexie: false, TSA: false, HPI: false },
    plan: "Gold",
    period: "Mensuel",
  });

  
  // INIT_FROM_URL: récupérer ?plan=&period= à l'ouverture de la page
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    const qpPlan = searchParams.get("plan");
    const qpPeriod = searchParams.get("period");
    const validPlan = qpPlan === "Normal" || qpPlan === "Gold" || qpPlan === "Platine" ? qpPlan : undefined;
    const validPeriod = qpPeriod === "Mensuel" || qpPeriod === "Annuel" ? qpPeriod : undefined;
    if (validPlan || validPeriod) {
      setState((s:any) => ({
        ...s,
        plan: validPlan ?? (s?.plan ?? "Normal"),
        period: validPeriod ?? (s?.period ?? "Mensuel"),
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
const subjectsCount = state.subjects.length;

  const addonsCount = useMemo(
    () => Object.values(state.modes).filter(Boolean).length,
    [state.modes]
  );

  const distinctLevelsCount = useMemo(
    () => new Set(state.subjects.map(s => s.niveau)).size,
    [state.subjects]
  );

  const __items: CartItem[] = __deriveCartItems(state || {});
const __period: BillingPeriod = ((state && state.period) ? state.period : "Mensuel") as BillingPeriod;

// Bannières de réduction
const __banners = (
  <DiscountBanners items={__items} period={__period} distinctLevelsCount={distinctLevelsCount} onRequestAnnual={() => setState((s) => ({ ...s, period: "Annuel" }))} />
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

      {__banners}

      <CartIncentives items={__items} period={__period} distinctLevelsCount={distinctLevelsCount}  plan={state.plan} onRequestAnnual={() => setState((s) => ({ ...s, period: "Annuel" }))} />

      <SummaryBar items={__items}
        distinctLevelsCount={distinctLevelsCount}
        plan={state.plan}
        period={state.period}
        onPlanChange={(plan) => setState((s) => ({ ...s, plan }))}
        onPeriodChange={(period) => setState((s) => ({ ...s, period }))}
      />
    </div>
  );
}
