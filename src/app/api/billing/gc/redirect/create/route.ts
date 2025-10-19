import { NextResponse } from "next/server";
import { getGcClient } from "@/lib/gocardless";
export async function POST(req: Request) {
  const { session_token, success_redirect_url, email, given_name, family_name, address_line1, city, postal_code, country_code } = await req.json().catch(()=> ({}));
  const gc = getGcClient();
  const flow = await gc.redirectFlows.create({
    params: {
      session_token: session_token || crypto.randomUUID(),
      success_redirect_url: success_redirect_url || `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/abonnement`,
      prefilled_customer: { email, given_name, family_name, address_line1, city, postal_code, country_code: country_code || "FR" },
    },
  });
  return NextResponse.json({ ok: true, redirect_url: flow.redirect_flows.redirect_url, id: flow.redirect_flows.id });
}
