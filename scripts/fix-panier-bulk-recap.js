const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

function must(rx, label) {
  if (!rx.test(s)) {
    console.error("❌ Introuvable:", label);
    process.exit(1);
  }
}

// 1) S'assurer que totalMonthly existe (ancre)
const rxTotalMonthlyBlock = /(const totalMonthly = useMemo\([\s\S]*?\n\s*\}, \[[^\]]*\]\);\n)/m;
must(rxTotalMonthlyBlock, "bloc totalMonthly");

// 2) Injecter les calculs d'affichage (si pas déjà présents)
if (!s.includes("/*__SS_DISCOUNT_DISPLAY__*/")) {
  s = s.replace(rxTotalMonthlyBlock, (m) => {
    return m + `
  /*__SS_DISCOUNT_DISPLAY__*/
  // Pour l'affichage du récap: montant mensuel AVANT remise famille / bulk (mais après remise annuelle si active)
  const beforeLevelDiscountMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    return Math.round(t * 100) / 100;
  }, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate]);

  const familyDiscountMonthlyValue = useMemo(() => {
    if (!familyDiscountActive) return 0;
    // -20% sur le total avant remise famille (après annuel)
    return Math.round(beforeLevelDiscountMonthly * 0.20 * 100) / 100;
  }, [familyDiscountActive, beforeLevelDiscountMonthly]);

  const bulkSameLevelDiscountMonthlyValue = useMemo(() => {
    if (!bulkSameLevelActive) return 0;
    return Math.round(beforeLevelDiscountMonthly * bulkSameLevelRate * 100) / 100;
  }, [bulkSameLevelActive, beforeLevelDiscountMonthly, bulkSameLevelRate]);

`;
  });
}

// 3) Injecter la ligne bulk dans le récap, au-dessus du total (ancre sur money(totalMonthly))
if (!s.includes("/*__SS_BULK_RECAP_LINE__*/")) {
  const rxMoneyTotal = /\{money\(totalMonthly\)\}/m;
  must(rxMoneyTotal, "{money(totalMonthly)}");

  s = s.replace(rxMoneyTotal, (m) => {
    return `
{bulkSameLevelActive ? (
  <div className="mt-2 flex items-center justify-between text-sm">
    <div className="text-slate-600">Remise matières (≥ 3 même niveau) (-10%)</div>
    <div className="font-semibold text-emerald-700">- {money(bulkSameLevelDiscountMonthlyValue)}</div>
  </div>
) : null}
{/*__SS_BULK_RECAP_LINE__*/}
` + m;
  });
}

// 4) Nettoyage: supprimer commentaires HTML éventuels (JSX interdit)
s = s.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, "");

fs.writeFileSync(file, s, "utf8");
console.log("✅ Panier: ligne récap bulk (-10% 3 matières) ajoutée (ancre totalMonthly).");
