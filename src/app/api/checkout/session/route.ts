import { NextResponse } from "next/server";
import { getStripeMode } from "@/lib/stripe/mode";
import { createMockCheckoutSession } from "@/lib/stripe/mock";
import { requireParentPinUnlocked, consumeParentPinUnlocked } from "@/lib/parentPinGuard";
import { computeCartPriceV2 } from "@/lib/price-engine";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type BillingPeriod = "Mensuel" | "Annuel";

type IncomingItem =
  | { id?: string; level?: string; subject?: string } // legacy front format
  | { id: string; type: "subject" | "mode"; title: string; level?: string; priceCents: number }; // normalized

type CartItem =
  | { id: string; type: "subject"; title: string; level?: string; priceCents: number }
  | { id: string; type: "mode"; title: string; priceCents: number };

async function getUnitPriceCentsFromDb(opts: {
  plan: "Normal" | "Gold" | "Platine";
  period: BillingPeriod;
  itemType: "subject" | "mode";
}): Promise<{ unitPriceCents: number; currency: string }> {
  const row = await prisma.pricingRule.findUnique({
    where: { plan_period_itemType: { plan: opts.plan, period: opts.period, itemType: opts.itemType } },
    select: { active: true, unitPriceCents: true, currency: true },
  });

  if (!row || !row.active) {
    throw new Error(`PRICING_RULE_MISSING:${opts.plan}:${opts.period}:${opts.itemType}`);
  }
  return { unitPriceCents: row.unitPriceCents, currency: row.currency };
}

function normalizeItems(input: IncomingItem[], unitPriceCents: number): CartItem[] {
  const out: CartItem[] = [];
  for (let i = 0; i < (input?.length || 0); i++) {
    const it: any = input[i];

    // Already normalized?
    if (it && typeof it === "object" && (it.type === "subject" || it.type === "mode")) {
      const priceCents = Math.max(0, Math.floor(Number(it.priceCents || 0)));
      out.push({
        id: String(it.id || `i${i + 1}`),
        type: it.type,
        title: String(it.title || it.subject || "Item"),
        ...(it.type === "subject" ? { level: it.level ? String(it.level) : undefined } : {}),
        priceCents,
      } as any);
      continue;
    }

    // Legacy format from front: { level, subject }
    const level = it?.level ? String(it.level) : undefined;
    const subject = it?.subject ? String(it.subject) : "Matiere";
    out.push({
      id: String(it?.id || `i${i + 1}`),
      type: "subject",
      title: subject,
      level,
      priceCents: unitPriceCents,
    });
  }
  return out;
}

export async function POST(req: Request) {
  // Parents PIN required before checkout
  try {
    await requireParentPinUnlocked();
  } catch (e: any) {
    if (e?.code === "PARENT_PIN_REQUIRED" || e?.message === "PARENT_PIN_REQUIRED") {
      return new Response(JSON.stringify({ error: "PARENT_PIN_REQUIRED" }), {
        status: 423,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw e;
  }

  try {
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json({ ok: false, error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const planClient = body?.plan as "Normal" | "Gold" | "Platine" | undefined;
    const plan: "Normal" | "Gold" | "Platine" = planClient || "Gold";

    const period: BillingPeriod = body?.period === "Mensuel" ? "Mensuel" : "Annuel";
    const distinctLevelsCount =
      typeof body?.distinctLevelsCount === "number" ? body.distinctLevelsCount : undefined;

    const itemsRaw: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];

    const mode = getStripeMode();

    // Mock
    if (mode === "mock") {
      const trialDays = 3;
      const session = await createMockCheckoutSession({ plan, period, trialDays });
      await consumeParentPinUnlocked();
      return NextResponse.json({ ok: true, mode, url: session.url });
    }

    // Live keys
    const secret = process.env.STRIPE_SECRET_KEY;
    const pk = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!secret || !pk) {
      return NextResponse.json(
        { ok: false, mode: "live", error: "Stripe live not configured: STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY missing." },
        { status: 503 }
      );
    }

    // Stripe SDK
    let stripe: any;
    try {
      const Stripe = (await import("stripe")).default;
      stripe = new Stripe(secret, { apiVersion: "2024-06-20" as any });
    } catch {
      return NextResponse.json(
        { ok: false, mode: "live", error: "Missing dependency 'stripe'. Run: npm i stripe (then restart)." },
        { status: 503 }
      );
    }

    // Resolve unit price from DB (subject items)
    let unitPriceCents = 0;
    let currency = "EUR";
    try {
      const r = await getUnitPriceCentsFromDb({ plan, period, itemType: "subject" });
      unitPriceCents = r.unitPriceCents;
      currency = r.currency;
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.startsWith("PRICING_RULE_MISSING:")) {
        return NextResponse.json(
          { ok: false, error: "PRICING_RULE_MISSING", detail: msg, hint: "Add PricingRule rows for this plan/period." },
          { status: 500 }
        );
      }
      throw e;
    }

    const items: CartItem[] = normalizeItems(itemsRaw, unitPriceCents);

    const pricing = computeCartPriceV2({
      items: items as any,
      period,
      distinctLevelsCount,
    });

    // Compact subjects string: "level:subject|level:subject"
    const subjectsCompact = items
      .filter((it: any) => it.type === "subject")
      .map((it: any) => `${it.level || ""}:${it.title || ""}`)
      .join("|");

    const grade = (items[0] as any)?.level ? String((items[0] as any).level) : "";

    console.log("[checkout/session] pricing", {
      userId: user.id,
      plan,
      period,
      unitPriceCents,
      itemsCount: items.length,
      subtotalCents: pricing.subtotalCents,
      totalCents: pricing.totalCents,
      family: pricing.familyEligible,
      multi: pricing.multiSubjectEligible,
      grade,
      subjectsCompact,
    });

    if (!pricing.totalCents || pricing.totalCents <= 0) {
      return NextResponse.json({ ok: false, error: "CHECKOUT_TOTAL_INVALID" }, { status: 400 });
    }

    const interval = period === "Annuel" ? "year" : "month";
    const productName = `Site Sciences - ${plan} (${period})`;
    const origin = new URL(req.url).origin;

    // Reuse existing Stripe customer
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });
    const stripeCustomerId = dbUser?.stripeCustomerId || null;

    let session: any;

    try {
      const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(stripeCustomerId
        ? { customer: stripeCustomerId }
        : user.email
        ? { customer_email: user.email }
        : {}),

      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: pricing.totalCents,
            recurring: { interval },
            product_data: { name: productName },
          },
          quantity: 1,
        },
      ],

      success_url: origin + "/merci?ok=1",
      cancel_url: origin + "/panier?cancel=1",

      metadata: {
        userId: user.id,
        userEmail: user.email ?? "",
        pricingVersion: "v2-db",
        plan,
        period,
        unitPriceCents: String(unitPriceCents),
        subtotalCents: String(pricing.subtotalCents),
        totalCents: String(pricing.totalCents),
        grade,
        subjects: subjectsCompact,
      },
    });
    } catch (e: any) {
      const msg = String(e?.message || "");
      const code = e?.code || e?.raw?.code;
      const param = e?.param || e?.raw?.param;

      // If we reused a stored stripeCustomerId from another environment (test vs live), Stripe returns resource_missing / No such customer
      const isMissingCustomer = (code === "resource_missing" && param === "customer") || msg.includes("No such customer");

      if (!isMissingCustomer) throw e;

      // Clear invalid customer id in DB so next attempts don't reuse it
      try {
        await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: null } });
      } catch {}

      // Retry WITHOUT customer, but keep email if available
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        ...(user.email ? { customer_email: user.email } : {}),

        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: pricing.totalCents,
              recurring: { interval },
              product_data: { name: productName },
            },
            quantity: 1,
          },
        ],

        success_url: origin + "/merci?ok=1",
        cancel_url: origin + "/panier?cancel=1",

        metadata: {
          userId: user.id,
          userEmail: user.email ?? "",
          pricingVersion: "v2-db",
          plan,
          period,
          unitPriceCents: String(unitPriceCents),
          subtotalCents: String(pricing.subtotalCents),
          totalCents: String(pricing.totalCents),
          grade,
          subjects: subjectsCompact,
        },
      });
    }

    await consumeParentPinUnlocked();
    return NextResponse.json({ ok: true, mode: "live", url: session.url });
  } catch (e: any) {
    console.error("[checkout/session] error", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
}
