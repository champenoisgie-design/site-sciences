// src/app/api/prof/students/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { addStudentLink, getClassSummary, hasTeacherMode } from "@/lib/teacher";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
  if (!(await hasTeacherMode(user.id))) return NextResponse.json({ ok:false, error:"forbidden" }, { status: 403 });

  const data = await getClassSummary(user.id);
  return NextResponse.json({ ok:true, data });
}

export async function POST(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
  if (!(await hasTeacherMode(user.id))) return NextResponse.json({ ok:false, error:"forbidden" }, { status: 403 });

  const body = await req.json().catch(()=> ({} as any));
  let studentId: string | null = null;

  if (typeof body.studentUserId === "string") studentId = body.studentUserId;
  else if (typeof body.studentEmail === "string") {
    const found = await prisma.user.findUnique({ where: { email: body.studentEmail } }).catch(()=>null) as any;
    studentId = found?.id || null;
  }

  if (!studentId) return NextResponse.json({ ok:false, error:"student_not_found" }, { status: 404 });

  await addStudentLink(user.id, studentId);
  return NextResponse.json({ ok:true });
}
