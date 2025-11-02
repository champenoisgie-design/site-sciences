"use client";
import React from "react";
import { SummaryBar } from "./SummaryBar";
import type { CartItem, BillingPeriod } from "@/lib/pricing/types";
import { motion } from "framer-motion";

async function createCheckoutSessionFallback(params: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number;
  plan?: "Normal" | "Gold" | "Platine";
}) {
  const res = await fetch("/api/checkout/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: params.items,
      period: params.period,
      distinctLevelsCount: params.distinctLevelsCount,
      plan: params.plan,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (data?.url) {
    window.location.assign(data.url);
  } else {
    alert("Impossible de créer une session de paiement (mock).");
    console.error("checkout/session:", data);
  }
}

export default function StickyCheckoutBar({
  items,
  period,
  distinctLevelsCount,
  plan,
  onCheckout,
}: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number;
  plan?: "Normal" | "Gold" | "Platine";
  onCheckout?: () => void;
}) {
  const handleCheckout = React.useCallback(() => {
    if (onCheckout) return onCheckout();
    return createCheckoutSessionFallback({ items, period, distinctLevelsCount, plan });
  }, [onCheckout, items, period, distinctLevelsCount, plan]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      <div className="mx-auto max-w-5xl px-4 pt-3 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <SummaryBar
              items={items}
              period={period}
              distinctLevelsCount={distinctLevelsCount}
              plan={plan}
            />
          </div>
          <button
            onClick={handleCheckout}
            className="shrink-0 inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold shadow-sm bg-black text-white hover:opacity-90"
          >
            Acheter maintenant
          </button>
        </div>

        {/* Disclaimer en bas de page */}
        <div className="w-full text-[11px] text-muted-foreground text-center mt-2">
          Prix affiché <strong>mensuel</strong>. En cas d’abonnement <strong>annuel</strong> (−20&nbsp;%), engagement de <strong>12 mois</strong>.
        </div>
      </div>
    </motion.div>
  );
}
