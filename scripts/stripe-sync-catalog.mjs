import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

const EUR = "eur";
const MODE_MONTHLY = 299;   // 2,99€
const MODE_YEARLY  = 2870;  // 28,70€ (12*2,99=35,88 -20% => 28,704 => 28,70)
const SKIN_ONEOFF  = 299;   // 2,99€ one-time

// Modes: ordre alphabétique pour l'affichage (Dys... puis HPI, TDAH, TSA)
const MODES = [
  { key: "DYSCALCULIE", label: "Dyscalculie" },
  { key: "DYSGRAPHIE",  label: "Dysgraphie" },
  { key: "DYSLEXIE",    label: "Dyslexie" },
  { key: "DYSPRAXIE",   label: "Dyspraxie" },
  { key: "HPI",         label: "HPI" },
  { key: "TDAH",        label: "TDAH" },
  { key: "TSA",         label: "TSA" },
];

const SKINS = [
  // Anime / Manga
  { key: "DRAGON_BALL",      label: "Dragon Ball Z / Super", group: "Anime / Manga" },
  { key: "DEMON_SLAYER",     label: "Demon Slayer",          group: "Anime / Manga" },
  { key: "ONE_PIECE",        label: "One Piece",             group: "Anime / Manga" },
  { key: "NARUTO",           label: "Naruto",                group: "Anime / Manga" },
  { key: "SAILOR_MOON",      label: "Sailor Moon",           group: "Anime / Manga" },

  // Jeux vidéo
  { key: "MARIO",            label: "Mario",                 group: "Jeux vidéo" },
  { key: "MINECRAFT",        label: "Minecraft",             group: "Jeux vidéo" },
  { key: "ZELDA",            label: "Zelda",                 group: "Jeux vidéo" },
  { key: "POKEMON",          label: "Pokémon",               group: "Jeux vidéo" },
  { key: "FORTNITE",         label: "Fortnite",              group: "Jeux vidéo" },
  { key: "ROBOT",            label: "Robot",                 group: "Jeux vidéo" },
  { key: "OVERWATCH",        label: "Overwatch",             group: "Jeux vidéo" },
  { key: "WORLD_OF_WARCRAFT",label: "World of Warcraft",     group: "Jeux vidéo" },

  // Films / Séries
  { key: "MARVEL",           label: "Marvel",                group: "Films / Séries" },
  { key: "HARRY_POTTER",     label: "Harry Potter",          group: "Films / Séries" },
  { key: "STRANGER_THINGS",  label: "Stranger Things",       group: "Films / Séries" },
  { key: "MERCREDI",         label: "Mercredi",              group: "Films / Séries" },
  { key: "MY_HERO_ACADEMIA", label: "My Hero Academia",      group: "Films / Séries" },
];

async function findProductByName(name) {
  const res = await stripe.products.search({
    query: `name:'${name.replace(/'/g, "\\'")}'`,
    limit: 1,
  });
  return res.data[0] || null;
}

async function ensureProduct(name, metadata) {
  const existing = await findProductByName(name);
  if (existing) return existing;
  return stripe.products.create({
    name,
    metadata,
    tax_code: "txcd_10103000",
  });
}

async function findPrice(productId, recurringInterval, unitAmount) {
  const prices = await stripe.prices.list({ product: productId, limit: 100 });
  return (
    prices.data.find((p) => {
      const okAmount = p.unit_amount === unitAmount;
      const okCurrency = p.currency === EUR;
      if (recurringInterval) {
        return okAmount && okCurrency && p.recurring?.interval === recurringInterval;
      }
      return okAmount && okCurrency && !p.recurring;
    }) || null
  );
}

async function ensurePrice({ productId, nickname, unitAmount, recurringInterval }) {
  const existing = await findPrice(productId, recurringInterval, unitAmount);
  if (existing) return existing;

  const payload = {
    product: productId,
    currency: EUR,
    unit_amount: unitAmount,
    nickname,
    ...(recurringInterval ? { recurring: { interval: recurringInterval } } : {}),
  };

  return stripe.prices.create(payload);
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY manquant (charge .env.local).");
    process.exit(1);
  }

  const outEnv = [];

  console.log("=== MODES (subscription monthly/yearly) ===");
  for (const m of MODES) {
    const prodName = `Site Sciences • Mode • ${m.label}`;
    const prod = await ensureProduct(prodName, { type: "mode", key: m.key });

    const priceM = await ensurePrice({
      productId: prod.id,
      nickname: `${m.label} / Mensuel`,
      unitAmount: MODE_MONTHLY,
      recurringInterval: "month",
    });

    const priceY = await ensurePrice({
      productId: prod.id,
      nickname: `${m.label} / Annuel (-20%)`,
      unitAmount: MODE_YEARLY,
      recurringInterval: "year",
    });

    outEnv.push(`STRIPE_PRICE_MODE_${m.key}_MONTH=${priceM.id}`);
    outEnv.push(`STRIPE_PRICE_MODE_${m.key}_YEAR=${priceY.id}`);

    console.log(`✅ ${m.label}: month=${priceM.id} year=${priceY.id}`);
  }

  console.log("\n=== SKINS (one-time payment) ===");
  for (const s of SKINS) {
    const prodName = `Site Sciences • Skin • ${s.label}`;
    const prod = await ensureProduct(prodName, { type: "skin", key: s.key, group: s.group });

    const price = await ensurePrice({
      productId: prod.id,
      nickname: `${s.label} (one-time)`,
      unitAmount: SKIN_ONEOFF,
      recurringInterval: null,
    });

    outEnv.push(`STRIPE_PRICE_SKIN_${s.key}=${price.id}`);

    console.log(`✅ ${s.label}: ${price.id}`);
  }

  console.log("\n=== LIGNES .env.local À AJOUTER ===\n");
  console.log(outEnv.join("\n"));
  console.log("\n➡️ Copie-colle ces lignes dans .env.local (et retire les anciennes STRIPE_PRICE_SKIN_* qui ne servent plus).");
}

main().catch((e) => {
  console.error("❌ ERROR", e);
  process.exit(1);
});
