import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getServerAccessState } from "@/lib/access/serverAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getCurrentUser();
  if (!me?.id) return NextResponse.json({ ok: true, user: null, access: { kind: "GUEST" } });

  const access = await getServerAccessState(me.id);

  if (access.kind === "TRIAL") {
    return NextResponse.json({
      ok: true,
      user: { id: me.id },
      access: {
        kind: "TRIAL",
        grade: access.grade,
        subject: access.subject,
        endsAt: access.endsAt,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    user: { id: me.id },
    access,
  });
}
