"use client";
import React from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import type { CartItem, BillingPeriod, Plan } from "@/lib/pricing/types";

const fetcher = (url: string, payload: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

type Props = {
  items?: CartItem[];
  period?: BillingPeriod;
  distinctLevelsCount?: number;
  plan?: Plan;
  onPlanChange?: (plan: Plan) => void;
  onPeriodChange?: (period: BillingPeriod) => void;
  levelsCount?: number; // legacy compat
};

export function SummaryBar({
  items,
  period,
  distinctLevelsCount,
  plan,
  levelsCount,
}: Props) {
  const hasNewAPI = Array.isArray(items) && !!period;
  const dlc =
    typeof distinctLevelsCount === "number"
      ? distinctLevelsCount
      : typeof levelsCount === "number"
      ? levelsCount
      : undefined;

  const { data } = useSWR(
    hasNewAPI ? ["/api/cart/price", { items, period, distinctLevelsCount: dlc }] : null,
    hasNewAPI ? ([url, payload]) => fetcher(url, payload) : null,
    { revalidateOnFocus: false }
  );

  const subtotalCents: number | undefined = data?.subtotalCents;
  const total = hasNewAPI ? data?.totalHuman ?? "—" : "—";
  const d = hasNewAPI
    ? (data?.appliedDiscounts as { annual?: boolean; family?: boolean; combo?: boolean } | undefined)
    : undefined;

  // Économie ANNUELLE si l'utilisateur est en affichage Mensuel
  const annualSaving =
    period === "Mensuel" && typeof subtotalCents === "number"
      ? (Math.floor(subtotalCents * 0.2 * 12) / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
      : null;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <div>
            Plan : <span className="font-medium">{plan ?? "—"}</span>
          </div>
          <div>
            Durée : <span className="font-medium">{period ?? "—"}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>
      </div>

      {/* Badges animés remises */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {d?.combo ? (
            <motion.span
              key="badge-combo"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700"
            >
              Méga pack −30%
            </motion.span>
          ) : null}
          {!d?.combo && d?.annual ? (
            <motion.span
              key="badge-annual"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700"
            >
              Annuel −20%
            </motion.span>
          ) : null}
          {!d?.combo && d?.family ? (
            <motion.span
              key="badge-family"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="px-2 py-1 rounded-full text-xs bg-sky-100 text-sky-700"
            >
              Pack Famille −20%
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Badge Premium (plan payant en Annuel) */}
      {plan !== "Normal" && period === "Annuel" ? (
        <motion.div
          key="badge-premium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-xs mt-1 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1"
        >
          🏅 Badge Premium activé — {plan} Annuel
        </motion.div>
      ) : null}

      {/* Micro incitations */}
      <div className="space-y-1">
        {typeof dlc === "number" && dlc < 2 ? (
          <div className="text-xs text-sky-600 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1">
            👨‍👩‍👧 Ajoute un autre niveau (ex: 4e + 2nde) pour débloquer le <strong>Pack Famille −20 %</strong> !
          </div>
        ) : null}
        {annualSaving ? (
          <div className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1">
            💡 En mode Annuel, économisez environ <strong>{annualSaving}</strong> / an.
          </div>
        ) : null}
      </div>

      <div className="text-[11px] text-muted-foreground">
        Simulation de paiement (dev) — les montants réels seront confirmés à l’étape de paiement.
      </div>
    </div>
  );
}

export default SummaryBar;
