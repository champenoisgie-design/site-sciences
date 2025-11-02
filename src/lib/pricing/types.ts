export type BillingPeriod = "Mensuel" | "Annuel";
export type Plan = "Normal" | "Gold" | "Platine";

export interface CartItem {
  id: string;
  type: "subject" | "mode" | "chapter" | "theme" | "bundle";
  title?: string;
  level?: string; // e.g., "5eme", "4eme", "Terminale"
  priceCents: number; // item price before global discounts
}

export interface CartPriceRequestBody {
  period: BillingPeriod;
  plan?: Plan;
  items: CartItem[];
  // If provided, overrides derived count from items[].level
  distinctLevelsCount?: number;
}

export interface AppliedDiscounts {
  annual: boolean;
  family: boolean;
  combo?: boolean;
}

export interface CartPriceResponseBody {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  totalHuman: string;
  appliedDiscounts: AppliedDiscounts;
  details: Array<{ label: string; amountCents: number }>;
}
