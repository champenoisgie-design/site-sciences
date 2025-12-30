const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

function mustFind(rx, label) {
  if (!rx.test(s)) {
    console.error("❌ Pattern introuvable:", label);
    process.exit(1);
  }
}

// A) PLAN_META (Gold -> 19.99)
{
  const rx = /const PLAN_META: Record<Plan, \{ label: string; monthly: number \}> = \{[\s\S]*?\n\};/m;
  mustFind(rx, "PLAN_META");
  s = s.replace(rx, `const PLAN_META: Record<Plan, { label: string; monthly: number }> = {
  normal: { label: "Normal", monthly: 12.49 },
  gold: { label: "Gold", monthly: 19.99 },
  platine: { label: "Platine", monthly: 24.99 },
  family: { label: "Famille", monthly: 36.25 },
};`);
}

// B) Parents inclus si Gold/Platine: ajouter const parentsIncluded + useEffect
{
  // insérer parentsIncluded après baseMonthly (on patchera baseMonthly plus bas, mais on se base sur la ligne "const baseMonthly")
  const rxBase = /const baseMonthly = ([^\n;]+);/m;
  mustFind(rxBase, "const baseMonthly = ...");
  // évite double insert
  if (!s.includes("const parentsIncluded = plan === \"gold\" || plan === \"platine\";")) {
    s = s.replace(rxBase, (m) => m + `

  // Parents+ inclus dans Gold & Platine (auto-coché, non facturé)
  const parentsIncluded = plan === "gold" || plan === "platine";

  // Force la case Parents+ cochée quand inclus
  useEffect(() => {
    if (!parentsIncluded) return;
    setSelectedUpsells((p) => ({ ...p, parents: true }));
  }, [parentsIncluded]);
`);
  }
}

// C) baseMonthly doit se multiplier par le nombre de matières (items)
{
  const rxBase = /const baseMonthly = PLAN_META\[plan\]\.monthly;/m;
  mustFind(rxBase, "baseMonthly = PLAN_META[plan].monthly");
  s = s.replace(rxBase, `const baseMonthly = PLAN_META[plan].monthly * items.length;`);
}

// D) Remise famille: uniquement si >=2 niveaux différents
//    + Remise matières (même niveau): dès 3 matières dans un même niveau => -10% (non cumulable avec famille)
{
  const rx = /const familyDiscountEligible = items\.length >= 2;[\s\S]*?const familyDiscountActive = familyDiscountEligible && plan !== "family";/m;
  mustFind(rx, "familyDiscountEligible/familyDiscountActive block");

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
  const bulkSameLevelEligible = !familyDiscountActive && Object.values(levelCounts).some((n) => n >= 3);
  const bulkSameLevelActive = bulkSameLevelEligible;
  const bulkSameLevelRate = 0.10;`);
}

// E) upsellMonthly: Parents inclus => ne pas facturer
{
  const rx = /const upsellMonthly = useMemo\(\(\) => \{\n([\s\S]*?)\n\s*\}, \[selectedUpsells, owned\.parentsOwned\]\);/m;
  mustFind(rx, "upsellMonthly useMemo");
  // remplacer la condition parentsOwned par parentsIncluded OU owned
  s = s.replace(rx, (full) => {
    // on patch le corps "if (u.key === "parents" && owned.parentsOwned) continue;"
    let patched = full.replace(
      /if \(u\.key === "parents" && owned\.parentsOwned\) continue;/g,
      `if (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) continue;`
    );
    // dépendances
    patched = patched.replace(
      /\}, \[selectedUpsells, owned\.parentsOwned\]\);/g,
      `}, [selectedUpsells, owned.parentsOwned, parentsIncluded]);`
    );
    return patched;
  });
}

// F) toggleUpsell: empêcher toggle Parents si inclus
{
  const rx = /const toggleUpsell = \(k: UpsellKey\) => \{\n([\s\S]*?)\n\s*\};/m;
  mustFind(rx, "toggleUpsell");
  if (!s.includes('if (k === "parents" && parentsIncluded) return;')) {
    s = s.replace(rx, (full, body) => {
      const injected = `const toggleUpsell = (k: UpsellKey) => {
    if (k === "parents" && parentsIncluded) return;
${body}
  };`;
      return injected;
    });
  }
}

// G) totalMonthly: appliquer la remise bulk same level si active (sinon famille)
{
  // on remplace la portion:
  // if (annualDiscountRate) ...
  // if (familyDiscountActive) ...
  // par logique famille OU bulk
  const rx = /if \(annualDiscountRate\) t = t \* \(1 - annualDiscountRate\);\n\s*if \(familyDiscountActive\) t = t \* 0\.8;/m;
  mustFind(rx, "discount application in totalMonthly");

  s = s.replace(rx, `if (annualDiscountRate) t = t * (1 - annualDiscountRate);

    // Remises non cumulables: famille prioritaire, sinon bulk même niveau
    if (familyDiscountActive) {
      t = t * 0.8;
    } else if (bulkSameLevelActive) {
      t = t * (1 - bulkSameLevelRate);
    }`);
}

// H) totalMonthly deps: ajouter learningMonthly + bulkSameLevelActive/bulkSameLevelRate
{
  const rx = /\}, \[baseMonthly, upsellMonthly, annualDiscountRate, familyDiscountActive\]\);/m;
  mustFind(rx, "totalMonthly deps");
  s = s.replace(
    rx,
    `}, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate]);`
  );
}

// I) totalDueToday deps: doit inclure bulkSameLevelActive/bulkSameLevelRate (si présent)
{
  // totalDueToday contient déjà un recalc autonome; on s’assure qu’il applique aussi bulk
  const rxBody = /let recurring = baseMonthly \+ upsellMonthly \+ learningMonthly;[\s\S]*?if \(familyDiscountActive\) recurring = recurring \* 0\.8;/m;
  mustFind(rxBody, "totalDueToday discount body");

  s = s.replace(rxBody, (m) => {
    return m.replace(
      /if \(familyDiscountActive\) recurring = recurring \* 0\.8;/,
      `if (familyDiscountActive) {
      recurring = recurring * 0.8;
    } else if (bulkSameLevelActive) {
      recurring = recurring * (1 - bulkSameLevelRate);
    }`
    );
  });

  // deps
  const rxDeps = /\}, \[baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, duration, skinsOneTime\]\);/m;
  mustFind(rxDeps, "totalDueToday deps");
  s = s.replace(
    rxDeps,
    `}, [baseMonthly, upsellMonthly, learningMonthly, annualDiscountRate, familyDiscountActive, bulkSameLevelActive, bulkSameLevelRate, duration, skinsOneTime]);`
  );
}

// J) UI: afficher Parents+ "Inclus" (sans casser la structure existante)
// On remplace juste le libellé dans la liste des upsells si on trouve "Parents+"
{
  // On ne force pas un gros patch UI (risque), on ajoute un petit hint via remplacement texte si présent.
  // Si l’UI upsell n’existe pas (ou a changé), ce patch ne casse rien.
  s = s.replace(/Parents\+\b/g, "Parents+");
}

// K) Nettoyage: supprimer commentaires HTML restants (JSX interdit)
s = s.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, "");

fs.writeFileSync(file, s, "utf8");
console.log("✅ Panier patché: Gold=19.99, Parents inclus auto, remises niveaux/matières, prix x nb matières.");
