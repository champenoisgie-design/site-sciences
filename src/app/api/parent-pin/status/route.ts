import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { getSessionIdFromCookies } from "@/lib/auth/sessionId";

export async function GET(req: Request) {
/*__SS_TRY_CATCH__*/
  try {
      const user = await getUserFromSessionServer();
      if (!user) return NextResponse.json({ unlocked: false, unlockedUntil: null });
    
      const sessionId = await getSessionIdFromCookies();
      if (!sessionId) return NextResponse.json({ unlocked: false, unlockedUntil: null });
    
      try {
        const row = await prisma.parentPinSession.findUnique({
          where: { userId_sessionId: { userId: user.id, sessionId } },
        });
    
        const unlocked = !!row && row.unlockedUntil > new Date();
        return NextResponse.json({ unlocked, unlockedUntil: row?.unlockedUntil ?? null });
      } catch {
        // table pas migrée => pas de crash
        return NextResponse.json({ unlocked: false, unlockedUntil: null });
      }
  } catch (e: any) {
    // Toujours renvoyer un JSON, jamais une réponse vide
    const message = e?.message ?? "UNKNOWN_ERROR";
    const stack = process.env.NODE_ENV === "development" ? (e?.stack ?? null) : null;
    return (await import("next/server")).NextResponse.json(
      { error: "INTERNAL_ERROR", message, stack },
      { status: 500 }
    );
  }
}
