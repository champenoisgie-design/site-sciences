import { NextResponse } from 'next/server'

function pick(...vals: (string | undefined | null)[]) {
  return vals.find((v) => typeof v === 'string' && v.trim().length > 0)
}

// Essaie plusieurs noms possibles (serveur & client) suivant type/plan/key
function resolvePriceId(params: URLSearchParams) {
  const type = params.get('type') || ''
  const plan = (params.get('plan') || '').toLowerCase()
  const key = (params.get('key') || '').toLowerCase()

  // 1) si fourni explicitement
  const explicit = params.get('priceId')
  if (explicit) return explicit

  // 2) serveur (process.env.*) — (dans App Router, c'est côté serveur)
  const env = process.env
  if (type === 'subject') {
    if (plan === 'gold' || plan === 'platine' || plan === 'normal') {
      return pick(
        env[`STRIPE_PRICE_${plan.toUpperCase()}`],
        env[`STRIPE_SUBJECT_PRICE_${plan.toUpperCase()}`],
        env[`NEXT_PUBLIC_STRIPE_PRICE_${plan.toUpperCase()}`],
      )
    }
  }
  if (type === 'pack') {
    if (key) {
      return pick(
        env[`STRIPE_PRICE_${key.toUpperCase()}`],
        env[`NEXT_PUBLIC_STRIPE_PRICE_${key.toUpperCase()}`],
      )
    }
  }
  if (type === 'mode') {
    if (key) {
      return pick(
        env[`STRIPE_PRICE_MODE_${key.toUpperCase()}`],
        env[`NEXT_PUBLIC_STRIPE_PRICE_MODE_${key.toUpperCase()}`],
      )
    }
  }
  return null
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sp = url.searchParams
    const type = sp.get('type') || 'subject'

    const priceId = resolvePriceId(sp)
    const secret = process.env.STRIPE_SECRET_KEY

    // Cas DEV: pas de secret ou pas de priceId → redirection douce (pas d'erreur JSON)
    if (!secret || !priceId) {
      const reason = !secret ? 'no-secret' : 'no-price'
      // Redirige vers tarifs avec note dev plutôt que 400
      const back =
        '/tarifs?checkout=simu&reason=' +
        encodeURIComponent(reason) +
        '&type=' +
        encodeURIComponent(type)
      return NextResponse.redirect(new URL(back, url.origin), { status: 302 })
    }

    // Secret + priceId → création de session Stripe (réel)
    // (si la dépendance stripe n'est pas installée, on bascule en simu propre)
    let stripe: any
    try {
      const Stripe = (await import('stripe')).default
      stripe = new Stripe(secret, { apiVersion: '2024-06-20' as any })
    } catch {
      const back = '/tarifs?checkout=simu&reason=stripe-missing'
      return NextResponse.redirect(new URL(back, url.origin), { status: 302 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: url.origin + '/merci?ok=1',
      cancel_url: url.origin + '/tarifs?cancel=1',
      allow_promotion_codes: true,
    })

    return NextResponse.redirect(session.url, { status: 303 })
  } catch (e: any) {
    // Filet de sécurité
    const url = new URL(req.url)
    const back = '/tarifs?checkout=simu&reason=exception'
    return NextResponse.redirect(new URL(back, url.origin), { status: 302 })
  }
}
