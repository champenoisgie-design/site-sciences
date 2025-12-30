const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

// Remplace tout le bloc totalDueToday existant (peu importe sa version)
// par une version autonome qui ne depend PAS de totalMonthly.
const rx = /const totalDueToday\s*=\s*useMemo\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\s*\);\s*/m;

if (!rx.test(s)) {
  console.error("❌ Bloc totalDueToday introuvable. Je ne modifie rien.");
  process.exit(1);
}

const replacement = `const totalDueToday = useMemo(() => {
    // Autonomous recalc to avoid referencing totalMonthly before init
    let recurring = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) recurring = recurring * (1 - annualDiscountRate);
    if (familyDiscountActive) recurring = recurring * 0.8;
    recurring = Math.round(recurring * 100) / 100;

    const recurringCharge = duration === "annual" ? recurring * 12 : recurring;
    const t = recurringCharge + skinsOneTime;
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, duration, skinsOneTime]);

`;

s = s.replace(rx, replacement);

fs.writeFileSync(file, s, "utf8");
console.log("✅ totalDueToday patched in", file);
