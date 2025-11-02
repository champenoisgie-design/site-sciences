"use client";
import React from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { BillingPeriod, CartItem, Plan } from "@/lib/pricing/types";

const fetcher = (url: string, payload: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

export default function CartIncentives({
  items,
  period,
  distinctLevelsCount,
  plan,
  onRequestAnnual,
}: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number;
  plan?: Plan;
  onRequestAnnual?: () => void;
}) {
  const { data } = useSWR(
    ["/api/cart/price", { items, period, distinctLevelsCount }],
    ([url, payload]) => fetcher(url, payload),
    { revalidateOnFocus: false }
  );

  const d = data?.appliedDiscounts as { annual?: boolean; family?: boolean; combo?: boolean } | undefined;
  const subtotalCents: number | undefined = data?.subtotalCents;
  const annualSaving =
    period === "Mensuel" && typeof subtotalCents === "number"
      ? (Math.floor(subtotalCents * 0.2 * 12) / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
      : null;

  const showMega = d?.combo || (d?.annual && d?.family);

  return (
    <div className="space-y-2 my-2">
      {!showMega && !d?.family && (distinctLevelsCount ?? 0) < 2 ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900"
        >
          <div className="text-sm font-semibold">Encore 1 niveau pour le Pack Famille −20 %</div>
          <div className="text-xs opacity-80">Ajoute un niveau différent pour débloquer la réduction.</div>
          <div className="mt-2">
            <a href="/niveaux" className="inline-flex items-center rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-100">
              ➕ Ajouter un autre niveau
            </a>
          </div>
        </motion.div>
      ) : null}

      {!showMega && !d?.annual && annualSaving ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-indigo-900"
        >
          <div className="text-sm font-semibold">Passez en Annuel et économisez {annualSaving} / an</div>
          <div className="text-xs opacity-80">La remise de −20 % s’applique sur la facturation annuelle.</div>
          <div className="mt-2">
            <button
              onClick={onRequestAnnual}
              className="inline-flex items-center rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-100"
            >
              🔁 Passer en Annuel
            </button>
          </div>
        </motion.div>
      ) : null}

      {showMega ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900"
        >
          <div className="text-sm font-semibold">🎉 Méga pack −30% activé</div>
          <div className="text-xs opacity-80">Annuel + Pack Famille cumulés : meilleure remise.</div>
        </motion.div>
      ) : null}

      {plan === "Gold" ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-900"
        >
          <div className="text-sm font-semibold">🔥 Passez au mode Platine</div>
          <div className="text-xs opacity-80">
            Profitez du <strong>support prioritaire</strong>, des <strong>défis avancés</strong> et du <strong>suivi expert</strong>.
          </div>
          <div className="mt-2">
            <a href="/tarifs" className="text-sm font-medium text-yellow-700 hover:underline">
              Découvrir les avantages Platine →
            </a>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
