import { NextResponse } from "next/server";
import { getGcClient } from "@/lib/gocardless";

// Helpers locaux (à la place de date-fns)
function addDays(date: Date, n: number) {
  return new Date(date.getTime() + n * 86400000);
}
function formatISO(d: Date) {
  return d.toISOString();
}

export async function POST(req: Request) {
  try {
    const { mandate_id, amount_cents, interval_unit, interval, plan_name } = await req.json();
    // essaie d'obtenir le client GC
    let gc: any;
    try {
      gc = await getGcClient();
    } catch {
      return NextResponse.json(
        { ok: false, error: "GoCardless non configuré (dev). Réessaie en prod." },
        { status: 503 }
      );
    }

    // Exemple de payload (à adapter à ton flow réel)
    const startDate = new Date();
    const nextPayment = addDays(startDate, 1);
    const schedule = {
      name: plan_name || "Abonnement",
      interval_unit: interval_unit || "monthly",
      interval: interval ?? 1,
      start_date: formatISO(nextPayment),
      amount: amount_cents ?? 999,
      currency: "EUR",
      links: { mandate: mandate_id },
    };

    // Ici tu appellerais gc.subscriptions.create(schedule)
    // const sub = await gc.subscriptions.create(schedule);
    // return NextResponse.json({ ok: true, subscription: sub });

    // Mock en dev:
    return NextResponse.json({ ok: true, mock: true, schedule });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "Erreur serveur GC" }, { status: 500 });
  }
}
