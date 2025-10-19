type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

/**
 * Rate limit léger (token bucket en mémoire).
 * @param key clé logique (ex: "otp") pour compartimenter
 * @param limit nb de requêtes par fenêtre
 * @param refillMs fenêtre en ms (ex: 60000)
 * @param ip IP du client (si dispo)
 * @returns true si autorisé, false sinon
 */
export function rateLimit({ key, limit, refillMs, ip }: { key: string; limit: number; refillMs: number; ip?: string | null }) {
  const id = `${key}:${ip || "noip"}`;
  const now = Date.now();
  const b = buckets.get(id) || { tokens: limit, last: now };
  // Recharge proportionnelle
  const elapsed = now - b.last;
  const refill = Math.floor((elapsed / refillMs) * limit);
  b.tokens = Math.min(limit, b.tokens + (refill > 0 ? refill : 0));
  b.last = now;

  if (b.tokens <= 0) {
    buckets.set(id, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(id, b);
  return true;
}
