"use client";
import React from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { CartItem, BillingPeriod } from "@/lib/pricing/types";

const fetcher = (url: string, payload: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

export default function DiscountBanners({
  items,
  period,
  distinctLevelsCount,
  onRequestAnnual,
}: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number;
  onRequestAnnual?: () => void;
}) {
  const { data } = useSWR(
    ["/api/cart/price", { items, period, distinctLevelsCount }],
    ([url, payload]) => fetcher(url, payload),
    { revalidateOnFocus: false }
  );

  const d = data?.appliedDiscounts as
    | { annual?: boolean; family?: boolean; combo?: boolean }
    | undefined;

  if (!d) return null;

  const showMega = d.combo || (d.annual && d.family);

  const Card: React.FC<{ className: string; title: React.ReactNode; desc: React.ReactNode }> = ({
    className,
    title,
    desc,
  }) => (
    <motion.div
      key={String(title)}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className={`w-full rounded-xl border px-4 py-3 ${className}`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs opacity-80">{desc}</div>
    </motion.div>
  );

  const BadgeActive = () => (
    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-600/20">
      ✅ Activée
    </span>
  );

  return (
    <div className="space-y-2 my-3">
      {showMega ? (
        <Card
          className="border-emerald-300 bg-emerald-50 text-emerald-900"
          title={<span>🎉 Méga pack −30% <BadgeActive /></span>}
          desc="Réduction combinée pour paiement annuel + pack famille."
        />
      ) : (
        <>
          <Card
            className={d.annual ? "border-indigo-300 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}
            title={<span>Carte “−20 % en Annuel” {d.annual ? <BadgeActive /> : null}</span>}
            desc={
              <>
                <span>Économie sur l’abonnement payé à l’année.</span>
                {!d.annual ? (
                  <div className="mt-2">
                    <button
                      onClick={onRequestAnnual}
                      className="inline-flex items-center rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-100"
                    >
                      🔁 Passer en Annuel
                    </button>
                  </div>
                ) : null}
              </>
            }
          />
          <Card
            className={d.family ? "border-sky-300 bg-sky-50 text-sky-900" : "border-slate-200 bg-white text-slate-700"}
            title={<span>Carte “Pack Famille −20 %” {d.family ? <BadgeActive /> : null}</span>}
            desc="Au moins deux niveaux différents sélectionnés."
          />
        </>
      )}
    </div>
  );
}
