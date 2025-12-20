import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  jar.delete("user_id");
  jar.delete("user_email");
  jar.delete("user_name");

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  return NextResponse.redirect(new URL("/login", base));
}
