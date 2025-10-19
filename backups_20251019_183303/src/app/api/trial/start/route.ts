import { NextResponse } from "next/server";
import { ensureTrial } from "@/lib/access/subscription";
import { getSessionUser } from "@/lib/auth"; // suppose un helper existant

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok:false, error:"unauthenticated" }, { status: 401 });

  const { kind } = await req.json().catch(() => ({ kind: "no-card-7d" }));
  if (!["no-card-7d","with-card-3d"].includes(kind)) {
    return NextResponse.json({ ok:false, error:"invalid kind" }, { status: 400 });
  }
  const trial = await ensureTrial(user.id, kind as any);
  return NextResponse.json({ ok:true, trial });
}
