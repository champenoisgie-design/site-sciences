import { NextResponse } from "next/server";
import { priceCart } from "@/lib/pricing/apply";

export async function GET() {
  // panier de test: 2 matières sur niveaux différents (+ une option)
  const items = [
    { id: "maths-4e", type: "subject" as const, title: "Maths", level: "4e", priceCents: 1299 },
    { id: "pc-2nde",  type: "subject" as const, title: "Physique", level: "2nde", priceCents: 1299 },
    { id: "mode-focus", type: "mode" as const, title: "Focus", priceCents: 299 },
  ];

  const annual = priceCart({ items, period: "Annuel", enableCombo: true });
  const monthly = priceCart({ items, period: "Mensuel", enableCombo: true });

  return NextResponse.json({
    sample: { itemsCount: items.length },
    annual: {
      totalHuman: annual.totalHuman,
      appliedDiscounts: annual.appliedDiscounts,
    },
    monthly: {
      totalHuman: monthly.totalHuman,
      appliedDiscounts: monthly.appliedDiscounts,
    },
  });
}
