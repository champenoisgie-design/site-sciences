import { NextResponse } from "next/server";
import { purchaseChapter } from "@/lib/access/subscription";
import { getSessionUser } from "@/lib/auth";
import { CHAPTER_PRICING } from "@/lib/pricing";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok:false, error:"unauthenticated" }, { status: 401 });

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
