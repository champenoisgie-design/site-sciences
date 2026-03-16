import { NextResponse } from "next/server";
import { getStripeMode } from "@/lib/stripe/mode";
import { createMockCheckoutSession } from "@/lib/stripe/mock";
import { requireParentPinUnlocked, consumeParentPinUnlocked } from "@/lib/parentPinGuard";
import { computeCartPriceV2 } from "@/lib/price-engine";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    /*__SS_ITEMS_DECL_TOP_V1__*/
  // MUST be declared before any usage (fallbackSubtotal uses items)
  let items: any[] = [];
  /*__SS_ITEMS_DECL_TOP_V1_END__*/

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
    

  
    
    
    /*__SS_LEARNING_KEYS_NORMALIZE_V1__*/
    // Accept both formats:
    // - frontend: { tdah, dys, tsa, hpi }
    // - backend expected (likely): { TDAH, DYS, TSA, HPI }
    try {
      const raw = (body as any)?.selectedLearning ?? (body as any)?.learning ?? {};
      const norm = {
        ...raw,
        TDAH: Boolean(raw?.TDAH ?? raw?.tdah),
        DYS:  Boolean(raw?.DYS  ?? raw?.dys),
        TSA:  Boolean(raw?.TSA  ?? raw?.tsa),
        HPI:  Boolean(raw?.HPI  ?? raw?.hpi),
      };
      (body as any).selectedLearning = norm;
      (body as any).learning = norm;
    } catch {}
    /*__SS_LEARNING_KEYS_NORMALIZE_V1_END__*/
    /*__SS_BRIDGE_MODES_FROM_LEARNING_V1__*/
    // Bridge selectedLearning -> modes (backend expects body.modes)
    try {
      const src = (body as any)?.selectedLearning ?? (body as any)?.learning ?? {};
      (body as any).modes = {
        TDAH: !!src?.TDAH,
        DYS:  !!src?.DYS,
        TSA:  !!src?.TSA,
        HPI:  !!src?.HPI,
      };
    } catch {}
    /*__SS_BRIDGE_MODES_FROM_LEARNING_V1_END__*/

/*__SS_STRIP_PLAN_FOR_ADDONS_ONLY_CLEAN_V1__*/
function __stripPlanForAddonsOnly(payload: any, body: any, items: any[]) {
  try {
    const itemsCount =
      Array.isArray(items) ? items.length :
      Array.isArray(body?.items) ? body.items.length : 0;

    const hasSkins = !!Object.values((body as any)?.skins ?? {}).some(Boolean);
    const hasLearning = !!Object.values((body as any)?.selectedLearning ?? (body as any)?.learning ?? {}).some(Boolean);
    const hasUpsells = !!Object.values((body as any)?.selectedUpsells ?? {}).some(Boolean);

    const addonsOnly = (itemsCount === 0) && (hasSkins || hasLearning || hasUpsells);

    if (!addonsOnly) return payload;
    if (!Array.isArray(payload?.line_items)) return payload;

    const before = payload.line_items.length;

    payload.line_items = payload.line_items.filter((li: any) => {
      const nm =
        li?.price_data?.product_data?.name ??
        li?.price_data?.product_data?.description ??
        li?.description ??
        "";

      const isInlinePlan =
        (typeof nm === "string") &&
        nm.startsWith("Site Sciences - ");

      return !isInlinePlan;
    });

    const after = payload.line_items.length;
    console.log("[checkout/session] addons-only: stripped inline plan", { before, after });
  } catch (e) {
    console.warn("[checkout/session] addons-only strip failed", e);
  }

  return payload;
}
/*__SS_STRIP_PLAN_FOR_ADDONS_ONLY_CLEAN_V1_END__*/



/*__SS_PLAN_NORMALIZE_V1__*/
    // Normalize plan casing (e.g. "gold" -> "Gold") to match pricing rules / Stripe mappings
    try {
      const p0 = String((body as any)?.plan ?? "");
      const p = p0 ? (p0[0].toUpperCase() + p0.slice(1).toLowerCase()) : p0;
      (body as any).plan = p;
    } catch {}
    /*__SS_PLAN_NORMALIZE_V1_END__*/

/*__SS_DEBUG_CHECKOUT_BODY_V1__*/ 
    try {
      console.log("[checkout/session] BODY keys", Object.keys(body || {}));
      console.log("[checkout/session] BODY.selectedLearning", (body || {}).selectedLearning);
      console.log("[checkout/session] BODY.learning", (body || {}).learning);
      console.log("[checkout/session] BODY.skins", (body || {}).skins);
      console.log("[checkout/session] BODY.selectedUpsells", (body || {}).selectedUpsells);
    } catch {}
    /*__SS_DEBUG_CHECKOUT_BODY_V1_END__*/
/* WITH_ADDONS_HELPER_V1 */
  const __withAddons = (payload: any) => {
    /*__SS_WITHADDONS_ADDONS_ONLY_V2__*/
    try {
      const __itemsCount = Array.isArray((body as any)?.items) ? (body as any).items.length : 0;
      const __hasSkins = !!Object.values((body as any)?.skins ?? {}).some(Boolean);
      const __hasLearning = !!Object.values((body as any)?.selectedLearning ?? (body as any)?.learning ?? {}).some(Boolean);
      const __hasUpsells = !!Object.values((body as any)?.selectedUpsells ?? {}).some(Boolean);

      const __addonsOnly = (__itemsCount === 0) && (__hasSkins || __hasLearning || __hasUpsells);

      // If addons-only, remove the subscription plan line_item from payload.line_items
      if (__addonsOnly && Array.isArray(payload?.line_items)) {
        const before = payload.line_items.length;
        payload.line_items = payload.line_items.filter((li: any) => {
          const nm =
            li?.price_data?.product_data?.name ??
            li?.price_data?.product_data?.description ??
            li?.description ??
            "";
          const isPlan = (typeof nm === "string") && nm.startsWith("Site Sciences - ");
          return !isPlan;
        });
        const after = payload.line_items.length;
        console.log("[checkout/session] addons-only: removed plan from payload", { before, after });
      }

      // Ensure Stripe mode matches recurring items
      // If any line_item has price_data.recurring => subscription, else payment
      const __hasRecurring =
        Array.isArray(payload?.line_items) &&
        payload.line_items.some((li: any) => !!li?.price_data?.recurring);

      if (__hasRecurring) payload.mode = "subscription";
      if (!__hasRecurring) payload.mode = "payment";

      // Safety: if addons-only and line_items empty -> reject
      if (__addonsOnly && (!Array.isArray(payload?.line_items) || payload.line_items.length === 0)) {
        // Keep payload but it'll fail anyway; better to be explicit in logs
        console.warn("[checkout/session] addons-only but no line_items => check env prices (skins/modes/upsells).");
      }

      console.log("[checkout/session] __withAddons decided", { addonsOnly: __addonsOnly, mode: payload?.mode, hasRecurring: __hasRecurring, count: Array.isArray(payload?.line_items) ? payload.line_items.length : 0 });
    } catch (e) {
      console.warn("[checkout/session] __withAddons addons-only patch failed", e);
    }
    /*__SS_WITHADDONS_ADDONS_ONLY_V2_END__*/

    const addons =
      (typeof __addonLineItems !== "undefined" && Array.isArray(__addonLineItems)) ? __addonLineItems : [];
    const before = Array.isArray(payload?.line_items) ? payload.line_items.length : 0;
    const merged = {
      ...(payload || {}),
      line_items: [ ...(Array.isArray(payload?.line_items) ? payload.line_items : []), ...addons ],
    };
    try {
      console.log("[checkout/session] FINAL line_items", {
        before,
        add: addons.length,
        after: merged.line_items.length,
        ids: merged.line_items.map((x:any)=>x?.price || x?.price_data?.product_data?.name || "unknown").slice(0, 20),
        mode: merged.mode,
      });
    } catch {}
    return merged;
  };
  /* END_WITH_ADDONS_HELPER_V1 */
/* ADDONS_LINEITEMS_V3
 * - Lit options depuis body.selectedUpsells OU body.options
 * - Normalise les clés (parentsPlus/parents, coachHebdo/coach, pdf, ai/ia)
 * - Ajoute des line_items Stripe via env:
 *   STRIPE_PRICE_ADDON_PARENTS_MONTH / YEAR
 *   STRIPE_PRICE_ADDON_COACH_MONTH / YEAR
 *   STRIPE_PRICE_ADDON_PDF_MONTH / YEAR
 *   STRIPE_PRICE_ADDON_IA_MONTH / YEAR
 */
const __planLower = String(body?.plan ?? "").toLowerCase();
const __periodLower = String(body?.period ?? "").toLowerCase();
const __isYear = __periodLower.includes("ann") || __periodLower.includes("year");
const __isPlatine = __planLower.includes("platine");
const __isGold = __planLower.includes("gold");

// selectedUpsells (client) ou options (ancien format)
const __rawUps = (body?.selectedUpsells ?? body?.options ?? {}) as any;

// normalisation de clés (on accepte plusieurs alias pour éviter les mismatch)
const __ups = {
  parentsPlus: !!(__rawUps.parentsPlus ?? __rawUps.parents ?? __rawUps.parent ?? __rawUps.parents_plus),
  coachHebdo:  !!(__rawUps.coachHebdo  ?? __rawUps.coach   ?? __rawUps.coaching ?? __rawUps.coach_hebdo),
  pdf:         !!(__rawUps.pdf         ?? __rawUps.fichesPdf ?? __rawUps.fichesPDF ?? __rawUps.fiches),
  ai:          !!(__rawUps.ai          ?? __rawUps.ia      ?? __rawUps.assistantIa ?? __rawUps.assistantIA),
};

const __addonPriceId = (k: "PARENTS"|"COACH"|"PDF"|"IA") => {
  const envKey = "STRIPE_PRICE_ADDON_" + k + "_" + (__isYear ? "YEAR" : "MONTH");
  const v = process.env[envKey];
  return v || "";
};

const __addonLineItems: any[] = [];

if (!__isPlatine) {
  // si Gold inclut "Parents+", ne pas facturer Parents+ (tu avais cette règle)
  if (__ups.parentsPlus && !__isGold) {
    const p = __addonPriceId("PARENTS"); if (p) __addonLineItems.push({ price: p, quantity: 1 });
  }
  if (__ups.coachHebdo) {
    const p = __addonPriceId("COACH"); if (p) __addonLineItems.push({ price: p, quantity: 1 });
  }
  if (__ups.pdf) {
    const p = __addonPriceId("PDF"); if (p) __addonLineItems.push({ price: p, quantity: 1 });
  }
  if (__ups.ai) {
    const p = __addonPriceId("IA"); if (p) __addonLineItems.push({ price: p, quantity: 1 });
  }
}

// Log utile (tu le verras dans le terminal)
console.log("[checkout/session] upsells received", { plan: body?.plan, period: body?.period, raw: __rawUps, normalized: __ups });
console.log("[checkout/session] addons line_items", { count: __addonLineItems.length, ids: __addonLineItems.map(x => x.price) });

/* END_ADDONS_LINEITEMS_V3 */

const planClient = body?.plan as "Normal" | "Gold" | "Platine" | undefined;
    const plan: "Normal" | "Gold" | "Platine" = planClient || "Gold";

    // PLATINE_FORCE_OPTIONS_SERVER_V2
    // Sécurité: Platine => options incluses, quoi qu'envoie le client
    if (String(plan).toLowerCase() === "platine") {
      // on force les options côté body pour cohérence back (sans crash)
      (body as any).selectedUpsells = { parents: true, coach: true, pdf: true, ia: true };
      (body as any).options = (body as any).options ?? {};
      Object.assign((body as any).options, { parentsPlus: true, coachHebdo: true, pdf: true, ai: true });
    }

  
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
      const rule = await prisma.pricingRule.findFirst({
        where: {
          plan,
          period,
          itemType: "subject",
          active: true,
        },
        select: { unitPriceCents: true, currency: true },
      });

      if (!rule?.unitPriceCents) {
        return NextResponse.json(
          {
            ok: false,
            error: "PRICING_RULE_MISSING",
            detail: "No active PricingRule for (plan, period, itemType=subject).",
            hint: "Add PricingRule rows for this plan/period/itemType=subject.",
          },
          { status: 500 }
        );
      }

      unitPriceCents = rule.unitPriceCents;
      currency = rule.currency || "EUR";
    } catch (e: any) {
      const msg = String(e?.message || "");
      return NextResponse.json(
        { ok: false, error: "PRICING_RULE_LOOKUP_FAILED", detail: msg },
        { status: 500 }
      );
    }

    
    /* NORMALIZE_ITEMS_INLINE_V1
     * Défini DANS POST pour éviter tout souci de scope après restore.
     */
    const normalizeItems = (itemsRaw: any[], unitPriceCents: number) => {
      const out: any[] = [];
      for (const it of (Array.isArray(itemsRaw) ? itemsRaw : [])) {
        const type = String(it?.type ?? "subject");
        if (type !== "subject") continue;

        const level = String(it?.level ?? it?.grade ?? "");
        const title = String(it?.title ?? it?.subject ?? "");
        const quantity = Math.max(1, Number(it?.quantity ?? 1));

        if (!level || !title) continue;

        out.push({
          type: "subject",
          level,
          title,
          unitPriceCents,
          quantity,
        });
      }
      return out;
    };
    /* END_NORMALIZE_ITEMS_INLINE_V1 */
  items = normalizeItems(itemsRaw, unitPriceCents);

    const pricing = computeCartPriceV2({
      items: items as any,
      period,
      distinctLevelsCount,
    });

    

/* PRICING_FALLBACK_V1
 * Si le price-engine renvoie 0 (mauvaise shape), on calcule au minimum:
 * total = somme(unitPriceCents|priceCents * quantity)
 */
if (!pricing?.totalCents || pricing.totalCents <= 0) {
  const fallbackSubtotal = (items || []).reduce((sum: number, it: any) => {
    const p = Number(it?.unitPriceCents ?? it?.priceCents ?? 0);
    const q = Math.max(1, Number(it?.quantity ?? 1));
    return sum + (p * q);
  }, 0);

  (pricing as any).subtotalCents = fallbackSubtotal;
  (pricing as any).totalCents = fallbackSubtotal;
  (pricing as any).familyEligible = false;
  (pricing as any).multiSubjectEligible = false;

  
  /*__SS_ITEMS_NORMALIZE_V1__*/
  // Normalize incoming items early (assign to top-scoped `items`)
  try {
    const __rawItems = Array.isArray((body as any)?.items) ? (body as any).items : [];
    items = __rawItems
      .map((it: any) => {
        const grade = String(it?.grade ?? it?.level ?? it?.classe ?? "");
        const subject = String(it?.subject ?? it?.matiere ?? it?.subjectKey ?? "");
        const subjects = Array.isArray(it?.subjects)
          ? it.subjects
          : (subject ? [subject] : []);
        return { ...it, grade, subject, subjects };
      })
      .filter((it: any) =>
        it?.grade &&
        (
          (it?.subject && it.subject !== "undefined") ||
          (Array.isArray(it?.subjects) && it.subjects.length > 0)
        )
      );
  } catch (e) {
    console.warn("[checkout/session] items normalize failed", e);
    items = [];
  }

  console.log("[checkout/session] BODY.items raw =", (body || {}).items);
  console.log("[checkout/session] normalized items =", items);
  /*__SS_ITEMS_NORMALIZE_V1_END__*/


console.log("[checkout/session] pricing fallback applied", {
    itemsPreview: (items || []).map((it: any) => ({
      type: it?.type,
      level: it?.level,
      title: it?.title,
      unitPriceCents: it?.unitPriceCents,
      priceCents: it?.priceCents,
      quantity: it?.quantity,
    })),
    fallbackSubtotal,
  });
}
/* END_PRICING_FALLBACK_V1 */

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
      
      /*__SS_ALLOW_ADDONS_WITH_ZERO_PRICING_V1__*/
      // If pricing is 0, allow checkout ONLY when there is at least one addon selected.
      // (Skins + learning modes + upsells can be purchased without choosing a subject.)
      const __hasSkins = !!Object.values((body as any)?.skins ?? {}).some(Boolean);
      const __hasLearning = !!Object.values((body as any)?.selectedLearning ?? (body as any)?.learning ?? {}).some(Boolean);
      const __hasUpsells = !!Object.values((body as any)?.selectedUpsells ?? {}).some(Boolean);
      const __hasAnyAddon = __hasSkins || __hasLearning || __hasUpsells;

      if (!__hasAnyAddon) {
        return NextResponse.json({ ok: false, error: "CHECKOUT_TOTAL_INVALID" }, { status: 400 });
      } else {
        console.log("[checkout/session] pricing=0 but addons selected -> continue");
      }
      /*__SS_ALLOW_ADDONS_WITH_ZERO_PRICING_V1_END__*/
    
}

    const interval = period === "Annuel" ? "year" : "month";
    const productName = `Site Sciences - ${plan} (${period})`;
    const origin = new URL(req.url).origin;

    // Reuse existing Stripe customer (may be invalid if env changed)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });
    const stripeCustomerId = dbUser?.stripeCustomerId || null;

    // CUSTOMER_FALLBACK_ON_RESOURCE_MISSING
    // PROMOS_AUTO: famille (-20) + matieres (-10) + cumul force (-30)
const __entries = String(subjectsCompact ?? "")
  .split("|")
  .map((p) => p.trim())
  .filter(Boolean);

const __grades = __entries
  .map((p) => payload.split(":")[0]?.trim())
  .filter(Boolean);

const __uniqueGrades = Array.from(new Set(__grades));

// ✅ Famille: au moins 2 niveaux (conforme à "≥ 2 niveaux")
const __isFamilyPromo = __uniqueGrades.length >= 2;

// Matieres: >=3 selections dans un meme niveau
const __counts: Record<string, number> = {};
for (const g of __grades) __counts[g] = (__counts[g] ?? 0) + 1;
const __isMatieresPromo = Object.values(__counts).some((n) => n >= 3);

// Choix du coupon (business rule)
const __coupon = (__isFamilyPromo && __isMatieresPromo)
  ? (process.env.STRIPE_COUPON_FAMMAT30 ?? "FAMMAT30")
  : (__isFamilyPromo
      ? (process.env.STRIPE_COUPON_FAMILY20 ?? "FAMILY20")
      : (__isMatieresPromo ? (process.env.STRIPE_COUPON_MAT10 ?? "MAT10") : undefined));

const __discounts = __coupon ? [{ coupon: __coupon }] : undefined;

console.log("[checkout/session] promos", {
  entries: __entries.length,
  uniqueGrades: __uniqueGrades,
  counts: __counts,
  isFamily: __isFamilyPromo,
  isMatieres: __isMatieresPromo,
  coupon: __coupon,
});

const basePayload: any = {
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
    };
    basePayload.discounts = __discounts;
    let session: any = null;

    try {
          /*__SS_MODE_DECIDE_BEFORE_CREATE_V1__*/
    // SELF-CONTAINED: compute modes/skins line_items here (avoid scope issues)
    const __env = (k: string) => (process.env as any)[k] as string | undefined;
    const __isYear = String((body as any)?.period || "").toLowerCase().includes("ann");
    const __extractTrue = (obj: any) => {
      if (!obj || typeof obj !== "object") return [] as string[];
      return Object.entries(obj).filter(([,v]) => !!v).map(([k]) => String(k));
    };
    const __modesSelectedLocal = __extractTrue((body as any)?.modes)
      .map(k => k.toUpperCase().replace(/[^A-Z0-9_]/g, "_"));
    const __skinsSelectedLocal = __extractTrue((body as any)?.skins)
      .map(k => k.toUpperCase().replace(/[^A-Z0-9_]/g, "_"));

    const __modeLineItemsLocal = __modesSelectedLocal.map((k) => {
      
      // Robust env lookup for mode prices (compat old + new env keys)
      const __suffixes = __isYear
        ? ["YEAR","ANNUAL","ANNUEL","YEARLY"]
        : ["MONTH","MONTHLY","MENSUEL"];
      let pid = "";

      // 1) New format: STRIPE_PRICE_MODE_<K>_<SUFFIX>
      for (const suf of __suffixes) {
        pid = __env("STRIPE_PRICE_MODE_" + k + "_" + suf);
        if (pid) break;
      }

      // 2) Old format: STRIPE_PRICE_MODE_<K>
      // If user only configured STRIPE_PRICE_MODE_TDAH, etc.
      // - If monthly checkout: use it
      // - If yearly checkout: we still accept it as fallback (but you SHOULD set _YEAR)
      if (!pid) {
        const legacy = __env("STRIPE_PRICE_MODE_" + k);
        if (legacy) {
          pid = legacy;
          console.warn("[checkout/session] using LEGACY mode env STRIPE_PRICE_MODE_" + k + " (please set _MONTH/_YEAR)");
        }
      }

      if (!pid) {
        console.warn("[checkout/session] missing Stripe mode price env for", { k, __isYear, tried: __suffixes, legacy: "STRIPE_PRICE_MODE_" + k });
      }
return pid ? ({ price: pid, quantity: 1 } as any) : null;
    }).filter(Boolean) as any[];

    const __skinLineItemsLocal = __skinsSelectedLocal.map((k) => {
      const pid = __env("STRIPE_PRICE_SKIN_" + k);
      return pid ? ({ price: pid, quantity: 1 } as any) : null;
    }).filter(Boolean) as any[];

    const __existing = Array.isArray((basePayload as any).line_items) ? (basePayload as any).line_items : [];
    const __merged = [ ...__existing, ...__modeLineItemsLocal, ...__skinLineItemsLocal ];
    (basePayload as any).line_items = __merged;

    const __hasAny = __merged.length > 0;
    const __hasSubjects = Array.isArray((body as any)?.items) && (body as any).items.length > 0;
    const __hasAddons = (typeof __addonLineItems !== "undefined" && Array.isArray(__addonLineItems) && __addonLineItems.length > 0);
    const __hasModes = __modeLineItemsLocal.length > 0;
    const __hasRecurring = __hasSubjects || __hasAddons || __hasModes;

    if (!__hasAny) {
    /*__SS_ALLOW_EMPTY_ITEMS_V1__*/
    // Allow checkout when items is empty IF skins/modes/upsells contain at least one selected option.
    // (Skins + learning modes are independent purchases.)
    const __hasSkins = !!Object.values((body as any)?.skins ?? {}).some(Boolean);
    const __hasLearning = !!Object.values((body as any)?.selectedLearning ?? (body as any)?.learning ?? {}).some(Boolean);
    const __hasUpsells = !!Object.values((body as any)?.selectedUpsells ?? {}).some(Boolean);
    const __hasAnyPurchase = __hasSkins || __hasLearning || __hasUpsells;

    if (!__hasAnyPurchase) {
      console.log("[checkout/session] NO_ITEMS_TO_CHECKOUT");
      return NextResponse.json({ error: "Aucun achat sélectionné." }, { status: 400 });
    }
    /*__SS_ALLOW_EMPTY_ITEMS_V1_END__*/
    console.log("[checkout/session] NO_ITEMS_TO_CHECKOUT");
      return new Response(JSON.stringify({ error: "NO_ITEMS" }), { status: 400, headers: { "content-type": "application/json" } });
    }

    (basePayload as any).mode = __hasRecurring ? "subscription" : "payment";
    console.log("[checkout/session] modes(selected)->line_items", { sel: __modesSelectedLocal, count: __modeLineItemsLocal.length });
    console.log("[checkout/session] skins(selected)->line_items", { sel: __skinsSelectedLocal, count: __skinLineItemsLocal.length });
    console.log("[checkout/session] mode decided", { mode: (basePayload as any).mode, recurring: __hasRecurring, total: __merged.length });
    console.log("[checkout/session] merged line_items ids", __merged.map((x:any)=>x?.price).filter(Boolean).slice(0, 50));
/*__SS_MODE_DECIDE_BEFORE_CREATE_V1_END__*/


session = await stripe.checkout.sessions.create(__stripPlanForAddonsOnly(basePayload, body, items));
    } catch (e: any) {

      const code = e?.code;
      const param = e?.param;
      const msg = String(e?.message || "");

      if (code === "resource_missing" && param === "customer") {
        console.warn("[checkout/session] customer invalid -> retry without customer", {
          stripeCustomerId,
          msg,
        });
        const retryPayload = { ...basePayload };
        delete retryPayload.customer;
        if (user.email) retryPayload.customer_email = user.email;

        try {
          session = await stripe.checkout.sessions.create(__stripPlanForAddonsOnly(basePayload, body, items));
        } catch (e2: any) {
          console.error("[checkout/session] Stripe create failed (retry)", {
            code: e2?.code,
            param: e2?.param,
            message: String(e2?.message || ""),
          });
          return NextResponse.json(
            { ok: false, error: "STRIPE_SESSION_CREATE_FAILED", detail: String(e2?.message || "unknown") },
            { status: 502 }
          );
        }
      } else {
        console.error("[checkout/session] Stripe create failed", {
          code,
          param,
          message: msg,
        });
        return NextResponse.json(
          { ok: false, error: "STRIPE_SESSION_CREATE_FAILED", detail: msg },
          { status: 502 }
        );
      }
    }

    const checkoutUrl = session && typeof session.url === "string" ? session.url : "";
    if (!checkoutUrl) {
      console.error("[checkout/session] Stripe session missing url", {
        hasSession: !!session,
        sessionType: typeof session,
        sessionId: session && session.id,
        plan,
        period,
      });
      return NextResponse.json({ ok: false, error: "STRIPE_SESSION_URL_MISSING" }, { status: 502 });
    }

    await consumeParentPinUnlocked();
    return NextResponse.json({ ok: true, mode: "live", url: checkoutUrl });
  } catch (e: any) {
    console.error("[checkout/session] error", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
}
