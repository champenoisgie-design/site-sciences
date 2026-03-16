const fs = require("fs");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const ENV_PATH = ".env.local";
let env = fs.readFileSync(ENV_PATH, "utf8");

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getEnv(key) {
  const rx = new RegExp("^" + esc(key) + "\\s*=\\s*(\"?)(.*?)\\1\\s*$", "m");
  const m = env.match(rx);
  return m ? String(m[2] || "").trim() : "";
}

function setEnv(key, value) {
  const line = `${key}="${value}"`;
  const rx = new RegExp("^" + esc(key) + "=.*$", "m");
  if (rx.test(env)) env = env.replace(rx, line);
  else env = env.replace(/\s*$/, "\n" + line + "\n");
}

function isRealPriceId(v) {
  return typeof v === "string" && /^price_[A-Za-z0-9]+$/.test(v) && !v.includes("xxx");
}

async function createRecurringPrice(productName, nickname, amount, interval) {
  const product = await stripe.products.create({ name: productName });
  const price = await stripe.prices.create({
    currency: "eur",
    unit_amount: amount,
    recurring: { interval },
    product: product.id,
    nickname,
  });
  return price.id;
}

async function ensureMode(modeKey) {
  const monthKey = `STRIPE_PRICE_MODE_${modeKey}_MONTH`;
  const yearKey  = `STRIPE_PRICE_MODE_${modeKey}_YEAR`;

  const curMonth = getEnv(monthKey);
  const curYear  = getEnv(yearKey);

  if (isRealPriceId(curMonth) && isRealPriceId(curYear)) {
    console.log(`ℹ️ MODE ${modeKey}: déjà OK`);
    return;
  }

  const monthId = await createRecurringPrice(
    `Mode apprentissage - ${modeKey}`,
    `${modeKey} monthly`,
    299,
    "month"
  );

  const yearId = await createRecurringPrice(
    `Mode apprentissage - ${modeKey}`,
    `${modeKey} yearly`,
    2868,
    "year"
  );

  setEnv(monthKey, monthId);
  setEnv(yearKey, yearId);

  console.log(`✅ MODE ${modeKey}: MONTH=${monthId} YEAR=${yearId}`);
}

async function ensureSkinOneTime(envKey) {
  const priceId = getEnv(envKey);

  if (!isRealPriceId(priceId)) {
    console.log(`⚠️ ${envKey}: valeur absente/invalide -> ${priceId || "(vide)"}`);
    return;
  }

  let price;
  try {
    price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
  } catch {
    console.log(`⚠️ ${envKey}: price introuvable (${priceId})`);
    return;
  }

  if (!price.recurring) {
    console.log(`ℹ️ ${envKey}: déjà one-time (${priceId})`);
    return;
  }

  const productId = typeof price.product === "string" ? price.product : price.product?.id;
  const unitAmount = price.unit_amount;
  const currency = price.currency;

  if (!productId || !unitAmount) {
    console.log(`⚠️ ${envKey}: impossible de recréer en one-time`);
    return;
  }

  const newPrice = await stripe.prices.create({
    currency,
    unit_amount: unitAmount,
    product: productId,
    nickname: `${envKey} one-time auto`,
  });

  setEnv(envKey, newPrice.id);
  console.log(`✅ ${envKey}: récurrent -> one-time ${newPrice.id}`);
}

(async () => {
  console.log("🚀 Création / réparation des MODES...");
  for (const mode of ["TDAH", "DYS", "TSA", "HPI"]) {
    await ensureMode(mode);
  }

  console.log("🚀 Vérification / réparation des SKINS...");
  const skinKeys = env
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x.startsWith("STRIPE_PRICE_SKIN_"))
    .map((x) => x.split("=")[0].trim());

  for (const key of skinKeys) {
    await ensureSkinOneTime(key);
  }

  env = env.replace(/\n{3,}/g, "\n\n");
  fs.writeFileSync(ENV_PATH, env, "utf8");

  console.log("");
  console.log("✅ .env.local mis à jour");
  console.log("📌 Résumé MODES :");
  for (const mode of ["TDAH", "DYS", "TSA", "HPI"]) {
    console.log(
      ` - ${mode}:`,
      getEnv(`STRIPE_PRICE_MODE_${mode}_MONTH`),
      getEnv(`STRIPE_PRICE_MODE_${mode}_YEAR`)
    );
  }

  console.log("");
  console.log("📌 Vérif SKIN DRAGON_BALL :");
  console.log(" -", getEnv("STRIPE_PRICE_SKIN_DRAGON_BALL"));
})().catch((e) => {
  console.error("❌ Échec automation Stripe:", e && e.message ? e.message : e);
  process.exit(1);
});
