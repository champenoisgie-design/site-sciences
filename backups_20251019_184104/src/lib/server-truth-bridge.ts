// src/lib/server-truth-bridge.ts
export type CartLine = { basePrice: number; subjectsCount: number; meta?: Record<string,any> };
export type CartInput = {
  currency?: string;
  primary: CartLine;
  familySecond?: CartLine | null;
  hasReferral?: boolean;
  isFirst100?: boolean;
};

/** Appelle ceci depuis ta logique panier pour publier un état cohérent côté UI debug. */
export function publishCartToServerTruth(cart: CartInput) {
  if (typeof window === "undefined") return;
  (window as any).__cartInput = cart;
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}
