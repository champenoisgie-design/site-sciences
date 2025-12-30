const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

// 1) Supprimer tout bloc totalDueToday existant (mauvais emplacement)
const before = s;
s = s.replace(
  /(\n\s*const totalDueToday = useMemo\(\(\) => \{[\s\S]*?\n\s*\}, \[[^\]]*\]\);\n?)/g,
  "\n"
);

if (before !== s) {
  console.log("✅ Ancien bloc totalDueToday supprimé (où qu'il soit).");
} else {
  console.log("ℹ️ Aucun bloc totalDueToday existant trouvé à supprimer.");
}

// 2) Trouver le bloc totalMonthly et injecter totalDueToday juste après (top-level)
const rxTotalMonthly = /(\n\s*const totalMonthly = useMemo\([\s\S]*?\n\s*\}, \[[^\]]*\]\);\n)/m;
const m = s.match(rxTotalMonthly);

if (!m) {
  console.error("❌ Impossible de trouver le bloc `const totalMonthly = useMemo(...)` pour injecter totalDueToday.");
  process.exit(1);
}

const injection = `
  // Total facturé aujourd’hui = abonnement (mensuel ou annuel) + achats uniques (skins)
  const totalDueToday = useMemo(() => {
    // Recalc autonome (évite toute dépendance d'ordre à totalMonthly)
    let recurring = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) recurring = recurring * (1 - annualDiscountRate);
    if (familyDiscountActive) recurring = recurring * 0.8;
    recurring = Math.round(recurring * 100) / 100;

    const recurringCharge = duration === "annual" ? recurring * 12 : recurring;
    const t = recurringCharge + skinsOneTime;
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, duration, skinsOneTime]);

`;

s = s.replace(rxTotalMonthly, (full, block) => block + injection);

// 3) Nettoyer les éventuels commentaires HTML injectés (interdits en JSX)
s = s.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, "");

fs.writeFileSync(file, s, "utf8");
console.log("✅ totalDueToday réinjecté au bon endroit (top-level) + nettoyage commentaires HTML.");
