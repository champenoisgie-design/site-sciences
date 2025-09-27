export const PLAN_TO_PRICE = {
  BRONZE: process.env.STRIPE_PRICE_BRONZE_ID!,
  GOLD: process.env.STRIPE_PRICE_GOLD_ID!,
  PLATINE: process.env.STRIPE_PRICE_PLATINE_ID!,
} as const;
