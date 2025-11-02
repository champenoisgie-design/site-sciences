export async function getGcClient() {
  const accessToken = process.env.GC_ACCESS_TOKEN!;
  const environment = (process.env.GC_ENVIRONMENT || "sandbox") as "sandbox" | "live";
  try {
    const mod: any = await import("gocardless-nodejs");
    const GoCardless = mod.default ?? mod;
    return new GoCardless(accessToken, { environment });
  } catch {
    // Pas installé en dev: on lève une erreur gérée côté route
    throw new Error("GoCardless SDK not installed");
  }
}
