import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getServerAccessState } from "@/lib/access/serverAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getCurrentUser();
  if (!me?.id) return NextResponse.json({ ok: true, user: null, access: { kind: "GUEST" } });

  const access = await getServerAccessState(me.id);

  // Normalize Date -> ISO for client
  if (access.kind === "TRIAL") {
    return NextResponse.json({
      ok: true,
      user: { id: me.id },
      access: {
        kind: "TRIAL",
        grade: access.grade,
        subject: access.subject,
        endsAt: access.endsAt instanceof Date ? access.endsAt.toISOString() : access.endsAt,
      },
    });
  }

  if (access.kind === "EXPIRED") {
    return NextResponse.json({
      ok: true,
      user: { id: me.id },
      access: {
        kind: "EXPIRED",
        lastPlan: access.lastPlan,
        endedAt: access.endedAt instanceof Date ? access.endedAt.toISOString() : access.endedAt,
      },
    });
  }

  if (access.kind === "FULL") {
    return NextResponse.json({
      ok: true,
      user: { id: me.id },
      access: {
        kind: "FULL",
        plan: (access as any).plan ?? "",
        subjects: (access as any).subjects ?? [],
        grades: (access as any).grades ?? [],
        endsAt: (access as any).endsAt instanceof Date ? (access as any).endsAt.toISOString() : (access as any).endsAt,
      },
    });
  }

  return NextResponse.json({ ok: true, user: { id: me.id }, access });
}
