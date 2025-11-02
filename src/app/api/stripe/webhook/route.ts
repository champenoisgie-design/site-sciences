import { NextResponse } from "next/server";
import { getStripeMode } from "@/lib/stripe/mode";

export async function POST(req: Request) {
  const mode = getStripeMode();
  const raw = await req.text();
  // En mock, on log juste l’événement
  console.log("[stripe webhook]", { mode, rawLength: raw.length });
  return NextResponse.json({ ok: true, mode });
}
