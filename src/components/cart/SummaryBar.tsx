"use client";
import React from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import type { CartItem, BillingPeriod } from "@/lib/pricing/types";

const fetcher = (url: string, payload: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

export function SummaryBar({
  items,
  period,
  distinctLevelsCount,
}: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number; // optional, can be derived on API
}) {
  const { data } = useSWR(
    ["/api/cart/price", { items, period, distinctLevelsCount }],
    ([url, payload]) => fetcher(url, payload),
    { revalidateOnFocus: false }
  );

  const total = data?.totalHuman ?? "—";
  const d = data?.appliedDiscounts as
    | { annual?: boolean; family?: boolean; combo?: boolean }
    | undefined;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-2xl font-bold">{total}</span>
      </div>

      {/* Badges coming from backend flags */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {d?.combo ? (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700"
            >
              Combo Annuel+Famille −30%
            </motion.span>
          ) : null}

          {!d?.combo && d?.annual ? (
            <motion.span
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
    </div>
  );
}
