const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

function must(rx, label) {
  if (!rx.test(s)) {
    console.error("❌ Introuvable:", label);
    process.exit(1);
  }
}

// A) Ajouter un calcul "beforeLevelDiscountMonthly" + valeurs de remises (famille/bulk) pour l'affichage récap
// On injecte juste après totalMonthly (ou totalDueToday si totalMonthly introuvable pour injection)
let injected = false;

// 1) Trouver le bloc totalMonthly useMemo
const rxTotalMonthlyBlock = /(const totalMonthly = useMemo\([\s\S]*?\n\s*\}, \[[^\]]*\]\);\n)/m;
must(rxTotalMonthlyBlock, "bloc totalMonthly");

if (!s.includes("/*__SS_DISCOUNT_DISPLAY__*/")) {
  s = s.replace(rxTotalMonthlyBlock, (m) => {
    injected = true;
    return m + `
  /*__SS_DISCOUNT_DISPLAY__*/
  // Pour l'affichage du récap: montant mensuel AVANT remise famille / bulk (mais après remise annuelle si active)
  const beforeLevelDiscountMonthly = useMemo(() => {
    let t = baseMonthly + upsellMonthly + learningMonthly;
    if (annualDiscountRate) t = t * (1 - annualDiscountRate);
    // NB: on n'applique PAS ici famille/bulk
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

if (!injected) {
  console.error("❌ Injection calculs récap: impossible (totalMonthly bloc non patché).");
  process.exit(1);
}

// B) Injecter la ligne récap bulk dans le sticky summary (même style que famille)
// On cherche un bloc JSX qui affiche déjà familyDiscountActive dans le récap.
const rxFamilyUI = /(\{familyDiscountActive\s*\?\s*\([\s\S]*?\)\s*:\s*null\s*\})/m;
must(rxFamilyUI, "UI récap famille (familyDiscountActive ? (...) : null)");

// On évite double insertion
if (!s.includes("/*__SS_BULK_RECAP_LINE__*/")) {
  s = s.replace(rxFamilyUI, (familyBlock) => {
    return familyBlock + `

              {/*__SS_BULK_RECAP_LINE__*/}
              {bulkSameLevelActive ? (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <div className="text-slate-600">Remise matières (≥ 3 même niveau) (-10%)</div>
                  <div className="font-semibold text-emerald-700">- {money(bulkSameLevelDiscountMonthlyValue)}</div>
                </div>
              ) : null}
`;
  });
}

// C) S'assurer que le récap famille montre un montant (si déjà le cas, on ne touche pas)
// (Optionnel) si tu as juste un badge sans montant, on ne force pas ici.

fs.writeFileSync(file, s, "utf8");
console.log("✅ Panier: ligne récap bulk (-10% 3 matières) ajoutée.");
