import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const raw = await req.text();
  try { console.log("GC webhook", raw.slice(0, 2000)); } catch {}
  return new NextResponse(null, { status: 200 });
}
