const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

function must(rx, label) {
  if (!rx.test(s)) {
    console.error("❌ Introuvable:", label);
    process.exit(1);
  }
}

// 1) Injecter les calculs "recap" (top-level, après totalDueToday idéalement)
const rxAnchorAfter = /(const totalDueToday = useMemo\([\s\S]*?\n\s*\}, \[[^\]]*\]\);\n)/m;
must(rxAnchorAfter, "bloc totalDueToday");

if (!s.includes("/*__SS_RIGHT_RECAP_MODEL__*/")) {
  s = s.replace(rxAnchorAfter, (m) => {
    return m + `

  /*__SS_RIGHT_RECAP_MODEL__*/
  // --- Modèle récap (onglet + global) ---
  const selectedUpsellsMonthly = useMemo(() => {
    return UPSELLS
      .filter((u) => selectedUpsells[u.key])
      .map((u) => ({
        key: u.key,
        label: u.label,
        monthly: (u.key === "parents" && (parentsIncluded || owned.parentsOwned)) ? 0 : u.monthly,
        included: (u.key === "parents" && parentsIncluded) ? true : false,
        owned: (u.key === "parents" && owned.parentsOwned) ? true : false,
      }))
      .filter((u) => u.monthly > 0 || u.included || u.owned);
  }, [selectedUpsells, parentsIncluded, owned.parentsOwned]);

  const selectedLearningList = useMemo(() => {
    return Object.entries(selectedLearning)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [selectedLearning]);

  const purchasedSkinsList = useMemo(() => {
    return Object.entries(purchasedSkins)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [purchasedSkins]);

  const itemsByLevel = useMemo(() => {
    const m: Record<string, Array<string>> = {};
    for (const it of items) {
      m[it.level] = m[it.level] || [];
      m[it.level].push(it.subject);
    }
    return m;
  }, [items]);

  const tabRecap = useMemo(() => {
    // Récap “ce que tu touches maintenant” selon l’onglet
    if (tab === "subjects") {
      return {
        title: "Récap onglet — Matières",
        lines: [
          { label: \`\${items.length} matière(s) sélectionnée(s)\`, value: null },
          ...Object.entries(itemsByLevel).map(([lvl, subs]) => ({
            label: lvl,
            value: subs.join(", "),
          })),
          { label: "Sous-total abonnement (base)", value: money(baseMonthly) + "/mois" },
        ],
      };
    }

    if (tab === "themes") {
      return {
        title: "Récap onglet — Thèmes & skins",
        lines: [
          { label: "Thème actif", value: themePack },
          { label: "Skin actif", value: skin },
          { label: "Skins achetés (unique)", value: purchasedSkinsList.join(", ") || "—" },
          { label: "Sous-total achats uniques", value: money(skinsOneTime) },
        ],
      };
    }

    if (tab === "learning") {
      return {
        title: "Récap onglet — Modes d’apprentissage",
        lines: [
          { label: "Modes choisis", value: selectedLearningList.map((x) => x.toUpperCase()).join(", ") || "—" },
          { label: "Sous-total modes", value: money(learningMonthly) + "/mois" },
          { label: "Rappel", value: "Renouvelé mensuellement (ou annuel si Annuel)" },
        ],
      };
    }

    // chapters (placeholder)
    return {
      title: "Récap onglet — Chapitres",
      lines: [
        { label: "Bientôt disponible", value: "Achat à l’unité par chapitre" },
      ],
    };
  }, [tab, items.length, itemsByLevel, baseMonthly, themePack, skin, purchasedSkinsList, skinsOneTime, selectedLearningList, learningMonthly]);

  const globalRecap = useMemo(() => {
    const lines: Array<{ label: string; value?: string; tone?: "muted" | "good" | "bad" }> = [];

    // Base
    lines.push({ label: \`Abonnement \${PLAN_META[plan].label} × \${items.length} matière(s)\`, value: money(baseMonthly) + "/mois" });

    // Upsells
    if (selectedUpsellsMonthly.length) {
      for (const u of selectedUpsellsMonthly) {
        if (u.included) lines.push({ label: \`\${u.label}\`, value: "Inclus", tone: "good" });
        else if (u.owned) lines.push({ label: \`\${u.label}\`, value: "Déjà acheté", tone: "good" });
        else lines.push({ label: \`\${u.label}\`, value: money(u.monthly) + "/mois" });
      }
    }

    // Learning
    if (learningMonthly > 0) {
      lines.push({ label: \`Modes d’apprentissage (\${selectedLearningList.length})\`, value: money(learningMonthly) + "/mois" });
    }

    // Achats uniques
    if (skinsOneTime > 0) {
      lines.push({ label: \`Skins (achat unique)\`, value: money(skinsOneTime) });
    }

    // Remises (affichage “comme famille”)
    if (familyDiscountActive && typeof familyDiscountMonthlyValue !== "undefined" && familyDiscountMonthlyValue > 0) {
      lines.push({ label: "Remise Famille (-20%)", value: "- " + money(familyDiscountMonthlyValue), tone: "good" });
    }
    if (bulkSameLevelActive && typeof bulkSameLevelDiscountMonthlyValue !== "undefined" && bulkSameLevelDiscountMonthlyValue > 0) {
      lines.push({ label: "Remise matières (≥3 même niveau) (-10%)", value: "- " + money(bulkSameLevelDiscountMonthlyValue), tone: "good" });
    }

    // Totaux
    lines.push({ label: "Total abonnement", value: money(totalMonthly) + "/mois" });
    lines.push({ label: "Total aujourd’hui", value: money(totalDueToday), tone: "bad" });

    return { title: "Récap général", lines };
  }, [
    plan,
    items.length,
    baseMonthly,
    selectedUpsellsMonthly,
    learningMonthly,
    selectedLearningList.length,
    skinsOneTime,
    familyDiscountActive,
    bulkSameLevelActive,
    typeof familyDiscountMonthlyValue !== "undefined" ? familyDiscountMonthlyValue : 0,
    typeof bulkSameLevelDiscountMonthlyValue !== "undefined" ? bulkSameLevelDiscountMonthlyValue : 0,
    totalMonthly,
    totalDueToday,
  ]);

`;
  });
}

// 2) Injecter UI récap droite: au niveau du bloc où le totalMonthly est affiché (ancre: {money(totalMonthly)})
// On enveloppe l’affichage existant dans un “stack” de 2 cartes, sans détruire le reste.
const rxMoneyTotal = /\{money\(totalMonthly\)\}/m;
must(rxMoneyTotal, "{money(totalMonthly)} ancre");

if (!s.includes("/*__SS_RIGHT_RECAP_UI__*/")) {
  // On cherche le conteneur le plus proche autour du total: on remplace un petit bloc de rendu du total
  // Approche: injecter un composant JSX avant le total (on a déjà bulk line injectée avant money(totalMonthly) dans ton patch précédent)
  s = s.replace(rxMoneyTotal, (m) => {
    return `
{/*__SS_RIGHT_RECAP_UI__*/}
<div className="mt-4 grid gap-3">
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs text-slate-500">Récap onglet</div>
    <div className="mt-1 text-sm font-semibold text-slate-900">{tabRecap.title}</div>
    <div className="mt-3 space-y-2">
      {tabRecap.lines.map((l, idx) => (
        <div key={idx} className="flex items-start justify-between gap-3 text-sm">
          <div className="text-slate-600">{l.label}</div>
          {l.value ? <div className="text-right font-semibold text-slate-900">{l.value}</div> : <div />}
        </div>
      ))}
    </div>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs text-slate-500">Récap général</div>
    <div className="mt-1 text-sm font-semibold text-slate-900">{globalRecap.title}</div>

    <div className="mt-3 space-y-2">
      {globalRecap.lines.map((l, idx) => (
        <div key={idx} className="flex items-start justify-between gap-3 text-sm">
          <div className="text-slate-600">{l.label}</div>
          {l.value ? (
            <div
              className={
                "text-right font-semibold " +
                (l.tone === "good" ? "text-emerald-700" : l.tone === "bad" ? "text-slate-900" : "text-slate-900")
              }
            >
              {l.value}
            </div>
          ) : (
            <div />
          )}
        </div>
      ))}
    </div>

    <div className="mt-3 text-xs text-slate-500">
      Total abonnement = €/mois. Total aujourd’hui = (mensuel ou annuel) + achats uniques.
    </div>
  </div>
</div>

${m}
`;
  });
}

// 3) Nettoyage: supprimer commentaires HTML (JSX interdit)
s = s.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, "");

fs.writeFileSync(file, s, "utf8");
console.log("✅ Panier: récap droite (onglet + général) injecté.");
