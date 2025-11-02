import { NextResponse } from "next/server";
import { getStripeMode } from "@/lib/stripe/mode";
import { createMockCheckoutSession } from "@/lib/stripe/mock";

// Optionnel futur: import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = body?.plan as "Normal" | "Gold" | "Platine" | undefined;
    const period = body?.period as "Mensuel" | "Annuel" | undefined;
    const distinctLevelsCount = body?.distinctLevelsCount ?? undefined;
    const items = Array.isArray(body?.items) ? body.items : [];

    const trialDays = 3; // confirmé

    const mode = getStripeMode();
    if (mode === "mock") {
      const session = await createMockCheckoutSession({ plan, period, trialDays });
      return NextResponse.json({ ok: true, mode, url: session.url });
    }

    // Mode live: on vérifie la présence des clés pour donner un message clair
    const sk = process.env.STRIPE_SECRET_KEY;
    const pk = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!sk || !pk) {
      return NextResponse.json(
        {
          ok: false,
          mode: "live",
          error: "Stripe live non configuré: STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY manquants.",
          hint: "Ajoute tes clés dans .env.local puis redémarre: STRIPE_MODE=live",
        },
        { status: 503 }
      );
    }

    // TODO: brancher Stripe réel ici quand les clés seront fournies.
    return NextResponse.json(
      { ok: false, mode: "live", error: "Stripe live: implémentation à activer une fois les clés fournies." },
      { status: 501 }
    );
  } catch (e: any) {
    console.error("[checkout/session] error", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
}
