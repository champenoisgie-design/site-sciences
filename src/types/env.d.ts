/** Variables d'env accessibles côté serveur (Next.js). Ajuste la liste au besoin. */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PRICING_ENABLE_COMBO?: "true" | "false";
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    GOCARDLESS_ACCESS_TOKEN?: string;
    NEXT_PUBLIC_SITE_URL?: string;
  }
}
