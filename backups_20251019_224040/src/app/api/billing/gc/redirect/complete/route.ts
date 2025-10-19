import { NextResponse } from "next/server";
import { getGcClient } from "@/lib/gocardless";
export async function POST(req: Request) {
  const { redirect_flow_id, session_token } = await req.json();
  const gc = getGcClient();
  const completed = await gc.redirectFlows.complete(redirect_flow_id, { params: { session_token } });
  const { links } = completed.redirect_flows;
  return NextResponse.json({ ok: true, customer: links?.customer, mandate: links?.mandate });
}
