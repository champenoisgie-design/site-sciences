const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

// 1) Remplacer la dépendance fautive (celle de ton erreur)
const depNeedle = "}, [totalMonthly, duration, skinsOneTime]);";
if (s.includes(depNeedle)) {
  s = s.replaceAll(
    depNeedle,
    '}, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, duration, skinsOneTime]);'
  );
  console.log("✅ Dépendances totalDueToday corrigées (suppression de totalMonthly).");
} else {
  console.log("ℹ️ Dépendance exacte non trouvée (peut-être déjà modifiée).");
}

// 2) Si le corps utilise encore totalMonthly, on le rend autonome
// a) remplace "const recurring = totalMonthly;" par recalcul autonome
if (s.includes("const recurring = totalMonthly;")) {
  s = s.replaceAll(
    "const recurring = totalMonthly;",
`let recurring = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) recurring = recurring * (1 - annualDiscountRate);
    if (familyDiscountActive) recurring = recurring * 0.8;
    recurring = Math.round(recurring * 100) / 100;`
  );
  console.log("✅ Corps totalDueToday corrigé (plus de totalMonthly).");
}

// 3) Sécurité : si totalMonthly est encore référencé dans totalDueToday deps
if (s.includes("[totalMonthly, duration, skinsOneTime]")) {
  console.log("❌ Il reste une dépendance [totalMonthly, duration, skinsOneTime].");
  process.exit(1);
}

fs.writeFileSync(file, s, "utf8");
console.log("✅ Patch écrit dans", file);
