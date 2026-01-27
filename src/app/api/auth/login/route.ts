import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionForUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const remember = Boolean(body?.remember);

    if (!email || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[login] user_not_found", { email });
      }
      return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
    }

    if (!user.passwordHash) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[login] PASSWORD_NOT_SET", { email, userId: user.id });
      }
      return NextResponse.json({ error: "PASSWORD_NOT_SET" }, { status: 400 });
    }

    const ok = await verifyPassword(password, user.passwordHash);

    if (process.env.NODE_ENV !== "production") {
      console.log("[login] compare", { email, userId: user.id, ok });
    }

    if (!ok) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
    }

    return await createSessionForUser(user.id, {
      email: user.email,
      name: user.name,
      remember,
    });
  } catch (e) {
    console.error("[/api/auth/login] error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
