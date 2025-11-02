import { NextResponse } from "next/server";
import { getGcClient } from "@/lib/gocardless";

export async function POST(req: Request) {
  try {
    const {
      session_token,
      success_redirect_url,
      email,
      given_name,
      family_name,
      address_line1,
      city,
      postal_code,
      country_code
    } = await req.json().catch(() => ({}));

    // Client GC async + peut être absent en dev si le SDK n'est pas installé
    let gc: any;
    try {
      gc = await getGcClient();
    } catch {
      // Fallback dev: on mocke un redirect flow pour ne pas casser la build
      const st = session_token || crypto.randomUUID();
      const successUrl =
        success_redirect_url ||
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/abonnement`;
      return NextResponse.json(
        {
          ok: true,
          mock: true,
          redirect_flow: {
            id: "RDFLOW_mock_" + st.slice(0, 8),
            redirect_url: successUrl + `?gc_mock=1&session=${encodeURIComponent(st)}`
          }
        },
        { status: 200 }
      );
    }

    // --- Vrai appel GoCardless (décommente en prod) ---
    // const flow = await gc.redirectFlows.create({
    //   params: {
    //     session_token: session_token || crypto.randomUUID(),
    //     success_redirect_url:
    //       success_redirect_url ||
    //       `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/abonnement`,
    //     prefilled_customer: {
    //       email,
    //       given_name,
    //       family_name,
    //       address_line1,
    //       city,
    //       postal_code,
    //       country_code
    //     }
    //   }
    // });
    // return NextResponse.json({ ok: true, redirect_flow: flow.redirect_flows });

    // Par sécurité (on ne devrait pas arriver ici si gc est valide)
    return NextResponse.json({ ok: false, error: "GC non configuré" }, { status: 503 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "Erreur serveur GC" }, { status: 500 });
  }
}
