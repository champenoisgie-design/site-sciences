const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

function ensureOnce(marker, fn) {
  if (s.includes(marker)) return;
  s = fn(s);
}
function must(rx, label) {
  if (!rx.test(s)) {
    console.error("❌ Introuvable:", label);
    process.exit(1);
  }
}

/** 1) PLAN_META: Gold mensuel = 19.99 */
{
  const rx = /const PLAN_META: Record<Plan, \{ label: string; monthly: number \}> = \{[\s\S]*?\n\};/m;
  must(rx, "PLAN_META");
  s = s.replace(rx, `const PLAN_META: Record<Plan, { label: string; monthly: number }> = {
  normal: { label: "Normal", monthly: 12.49 },
  gold: { label: "Gold", monthly: 19.99 },
  platine: { label: "Platine", monthly: 24.99 },
  family: { label: "Famille", monthly: 36.25 },
};`);
}

/** 2) baseMonthly = monthly * items.length (prix par matière) */
{
  const rx = /const baseMonthly = PLAN_META\[plan\]\.monthly(?: \* items\.length)?;/m;
  must(rx, "const baseMonthly = PLAN_META[plan].monthly ...");
  s = s.replace(rx, `const baseMonthly = PLAN_META[plan].monthly * items.length;`);
}

/** 3) Parents inclus auto (gold/platine) + lock toggle */
ensureOnce("/*__SS_PARENTS_INCLUDED__*/", (t) => {
  const rx = /const baseMonthly = PLAN_META\[plan\]\.monthly \* items\.length;\n/m;
  must(rx, "baseMonthly line for parentsIncluded injection");
  return t.replace(rx, (m) => m + `
  /*__SS_PARENTS_INCLUDED__*/
  const parentsIncluded = plan === "gold" || plan === "platine";

  // Auto-coché si inclus (et non facturé)
  useEffect(() => {
    if (!parentsIncluded) return;
    setSelectedUpsells((p) => ({ ...p, parents: true }));
  }, [parentsIncluded]);
`);
});

/** 4) upsellMonthly: Parents non facturé si inclus */
{
  const rx = /const upsellMonthly = useMemo\(\(\) => \{[\s\S]*?\}, \[[^\]]*\]\);\n/m;
  must(rx, "upsellMonthly useMemo");
  // patch condition "parentsOwned"
  s = s.replace(
    /if \(u\.key === "parents" && owned\.parentsOwned\) continue;/g,
    `if (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) continue;`
  );
  // patch deps: ajoute parentsIncluded si pas déjà
  s = s.replace(/\}, \[([^\]]*)\]\);\n/g, (m, deps) => {
    if (!m.includes("upsellMonthly")) return m; // éviter d'autres useMemo
    return m;
  });
  // plus sûr: remplace la ligne deps upsellMonthly uniquement
  s = s.replace(
    /\}, \[selectedUpsells, owned\.parentsOwned\]\);\n/m,
    `}, [selectedUpsells, owned.parentsOwned, parentsIncluded]);\n`
  );
}

/** 5) toggleUpsell: empêcher click Parents si inclus */
{
  const rx = /const toggleUpsell = \(k: UpsellKey\) => \{\n([\s\S]*?)\n\s*\};/m;
  must(rx, "toggleUpsell");
  if (!s.includes('if (k === "parents" && parentsIncluded) return;')) {
    s = s.replace(rx, (full, body) => {
      // garde le corps existant et ajoute le guard au début
      return `const toggleUpsell = (k: UpsellKey) => {
    if (k === "parents" && parentsIncluded) return;
${body}
  };`;
    });
  }
}

/** 6) Remises: famille = 2 niveaux différents ; bulk même niveau = 3 matières (non cumulable) */
{
  // remplace l'ancien bloc famille (souple)
  const rx = /\/\/ pack famille[\s\S]*?const familyDiscountActive[\s\S]*?;\n/m;
  // si ce commentaire n'existe pas, on remplace l'ancien duo eligible/active
  if (rx.test(s)) {
    s = s.replace(rx, `  // Remise famille: uniquement si au moins 2 niveaux différents
  const levelCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const it of items) m[it.level] = (m[it.level] || 0) + 1;
    return m;
  }, [items]);

  const uniqueLevelsCount = useMemo(() => Object.keys(levelCounts).length, [levelCounts]);

  const familyDiscountEligible = uniqueLevelsCount >= 2;
  const familyDiscountActive = familyDiscountEligible && plan !== "family";

  // Remise matières (même niveau): dès 3 matières dans le même niveau => -10%
  // (non cumulable avec la remise famille)
  const bulkSameLevelActive = !familyDiscountActive && Object.values(levelCounts).some((n) => n >= 3);
  const bulkSameLevelRate = 0.10;
`);
  } else {
    const rx2 = /const familyDiscountEligible[\s\S]*?const familyDiscountActive[\s\S]*?;\n/m;
    must(rx2, "familyDiscountEligible/familyDiscountActive");
    s = s.replace(rx2, `  // Remise famille: uniquement si au moins 2 niveaux différents
  const levelCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const it of items) m[it.level] = (m[it.level] || 0) + 1;
    return m;
  }, [items]);

  const uniqueLevelsCount = useMemo(() => Object.keys(levelCounts).length, [levelCounts]);

  const familyDiscountEligible = uniqueLevelsCount >= 2;
  const familyDiscountActive = familyDiscountEligible && plan !== "family";

  // Remise matières (même niveau): dès 3 matières dans le même niveau => -10%
  // (non cumulable avec la remise famille)
  const bulkSameLevelActive = !familyDiscountActive && Object.values(levelCounts).some((n) => n >= 3);
  const bulkSameLevelRate = 0.10;
`);
  }
}

/** 7) totalMonthly: applique famille sinon bulk */
{
  // patch dans le body totalMonthly
  const rxLine = /if \(familyDiscountActive\) t = t \* 0\.8;/m;
  if (rxLine.test(s)) {
    s = s.replace(rxLine, `// Remises non cumulables: famille prioritaire, sinon bulk même niveau
    if (familyDiscountActive) {
      t = t * 0.8;
    } else if (bulkSameLevelActive) {
      t = t * (1 - bulkSameLevelRate);
    }`);
  } else {
    // si déjà en bloc, on ne touche pas
  }

  // deps totalMonthly (souple)
  const rxDeps = /(const totalMonthly = useMemo\([\s\S]*?\}, )\[[^\]]*\](\);)/m;
  must(rxDeps, "deps totalMonthly");
  s = s.replace(rxDeps, `$1[baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate]$2`);
}

/** 8) totalDueToday: applique même logique + deps */
{
  // body: remplace "if (familyDiscountActive) recurring = recurring * 0.8;" s'il existe
  const rx = /if \(familyDiscountActive\) recurring = recurring \* 0\.8;/m;
  if (rx.test(s)) {
    s = s.replace(rx, `if (familyDiscountActive) {
      recurring = recurring * 0.8;
    } else if (bulkSameLevelActive) {
      recurring = recurring * (1 - bulkSameLevelRate);
    }`);
  }

  // deps totalDueToday (souple)
  const rxDeps = /(const totalDueToday = useMemo\([\s\S]*?\}, )\[[^\]]*\](\);)/m;
  must(rxDeps, "deps totalDueToday");
  s = s.replace(rxDeps, `$1[baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate, duration, skinsOneTime]$2`);
}

/** 9) Nettoyage: supprimer commentaires HTML qui cassent JSX */
s = s.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, "");

fs.writeFileSync(file, s, "utf8");
console.log("✅ Patch OK:", file);
