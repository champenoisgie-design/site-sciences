"use client";
import React from "react";
import { SummaryBar } from "./SummaryBar";
import type { CartItem, BillingPeriod } from "@/lib/pricing/types";
import { motion } from "framer-motion";

export default function StickyCheckoutBar({
  items,
  period,
  distinctLevelsCount,
  onCheckout,
}: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number;
  onCheckout?: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <SummaryBar items={items} period={period} distinctLevelsCount={distinctLevelsCount} />
        </div>
        <button
          onClick={onCheckout}
          className="shrink-0 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold shadow-sm bg-black text-white hover:opacity-90"
        >
          Procéder au paiement
        </button>
      </div>
    </motion.div>
  );
}
