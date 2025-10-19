import { NextResponse } from "next/server";
import { getGcClient } from "@/lib/gocardless";
import { addDays, formatISO } from "date-fns";
export async function POST(req: Request) {
  const { mandate_id, amount_cents, interval_unit, interval, plan_name } = await req.json();
  const gc = getGcClient();
  const start_date = formatISO(addDays(new Date(), 3), { representation: "date" }); // essai 3 jours
  const sub = await gc.subscriptions.create({
    params: {
      amount: String(amount_cents ?? 999),
      currency: "EUR",
      name: plan_name || "Abonnement Site Sciences",
      interval_unit: (interval_unit || "monthly") as any,
      interval: interval ?? 1,
      links: { mandate: mandate_id },
      start_date,
    },
  });
  return NextResponse.json({ ok: true, id: sub.subscriptions.id, status: sub.subscriptions.status });
}
