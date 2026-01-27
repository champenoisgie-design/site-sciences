import { NextResponse } from "next/server";
import { requireContentAccess, HttpError } from "@/lib/access/serverAccess";
import { purchaseChapter } from "@/lib/access/subscription";
import { getSessionUser } from "@/lib/auth";
const CHAPTER_PRICING = { perChapterEUR: 4.99 } as const;


export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok:false, error:"unauthenticated" }, { status: 401 });
  // PAYWALL — achat chapitre: nécessite FULL (un trial ne doit pas acheter sans passer par panier/Stripe ensuite, mais on bloque si PAYWALL)
  try {
    await requireContentAccess({ userId: user.id });
  } catch (e: any) {
    if (e instanceof HttpError) return NextResponse.json(e.body, { status: e.status });
    console.error(e);
    return NextResponse.json({ ok:false, error:"INTERNAL_ERROR" }, { status: 500 });
  }



  const body = await req.json().catch(() => ({}));
  const { subject, level, chapterKey } = body;
  if (!subject || !level || !chapterKey) {
    return NextResponse.json({ ok:false, error:"missing fields" }, { status: 400 });
  }

  // Ici: déclencher un PaymentIntent Stripe coté serveur AVANT d'accorder l'accès.
  // Pour le POC, on enregistre directement l’accès (à remplacer par logique Stripe + webhook).
  const priceCents = Math.round(CHAPTER_PRICING.perChapterEUR * 100);
  const rec = await purchaseChapter({ userId: user.id, subject, level, chapterKey, priceCents });
  return NextResponse.json({ ok:true, access: rec });
}
