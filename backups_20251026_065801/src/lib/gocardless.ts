import GoCardless from "gocardless-nodejs";
export function getGcClient() {
  const accessToken = process.env.GC_ACCESS_TOKEN!;
  const environment = (process.env.GC_ENVIRONMENT || "sandbox") as "sandbox" | "live";
  if (!accessToken) throw new Error("GC_ACCESS_TOKEN manquant");
  return GoCardless(accessToken, { environment });
}
