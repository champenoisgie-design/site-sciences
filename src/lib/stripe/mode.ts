export function getStripeMode(): "mock" | "live" {
  if (typeof process !== "undefined") {
    const m = process.env.STRIPE_MODE?.toLowerCase();
    if (m === "live") return "live";
  }
  return "mock";
}
