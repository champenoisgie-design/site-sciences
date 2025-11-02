export type BillingPeriod = "Mensuel" | "Annuel";
export type Plan = "Normal" | "Gold" | "Platine";

export type CartItem =
  | { id: string; type: "subject"; title: string; level?: string; priceCents: number }
  | { id: string; type: "mode"; title: string; priceCents: number };

export type AppliedDiscounts = {
  annual?: boolean;
  family?: boolean;
  combo?: boolean;
};
