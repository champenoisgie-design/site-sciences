const fs = require('fs');

const file = 'src/app/panier/page.tsx';
let s = fs.readFileSync(file, 'utf8');

function ensureOnce(marker, fn) {
  if (s.includes(marker)) return;
  s = fn(s);
}

// 0) sanity
if (!s.includes('export default function PanierPage()')) {
  console.error('❌ PanierPage introuvable dans', file);
  process.exit(1);
}

// 1) Ajouter types + constantes (learning add-ons + prix)
ensureOnce('/*__SS_ADDONS_TYPES__*/', (t) => {
  return t.replace(
    /type Skin = "neon" \| "solaire" \| "pastel";\n/,
    (m) => m +
`/*__SS_ADDONS_TYPES__*/
type LearningAddon = "tdah" | "dys" | "tsa" | "hpi";

const LEARNING_ADDON_PRICE_MONTHLY = 2.99; // abonnement (mensuel ou annuel)
const SKIN_PRICE_ONE_TIME = 2.99;          // achat unique

const LEARNING_ADDONS: Array<{ key: LearningAddon; label: string; desc: string }> = [
  { key: "tdah", label: "TDAH", desc: "Timers + micro-étapes + anti-distraction" },
  { key: "dys",  label: "DYS",  desc: "Typo adaptée + consignes simplifiées" },
  { key: "tsa",  label: "TSA",  desc: "Structure + prévisibilité + feedback stable" },
  { key: "hpi",  label: "HPI",  desc: "Parcours accéléré + défis avancés" },
];
`
  );
});

// 2) Ajouter state: learning add-ons + skins achetés (achat unique)
ensureOnce('/*__SS_ADDONS_STATE__*/', (t) => {
  return t.replace(
    /const \[selectedUpsells, setSelectedUpsells\] = useState<Record<UpsellKey, boolean>>\([\s\S]*?\);\n/s,
    (m) => m +
`\n  /*__SS_ADDONS_STATE__*/
  const [selectedLearning, setSelectedLearning] = useState<Record<LearningAddon, boolean>>({
    tdah: false, dys: false, tsa: false, hpi: false,
  });

  // achat unique: on peut acheter 1+ skins (même si on en "utilise" un seul)
  const [purchasedSkins, setPurchasedSkins] = useState<Record<Skin, boolean>>({
    neon: false, solaire: false, pastel: false,
  });
`
  );
});

// 3) Calcul: learningMonthly, skinsOneTime, totalToday (mensuel/annuel + one-shot)
ensureOnce('/*__SS_ADDONS_TOTALS__*/', (t) => {
  // Injecter learningMonthly après upsellMonthly
  t = t.replace(
    /const upsellMonthly = useMemo\([\s\S]*?\);\n\n/s,
    (m) => m +
`  const learningMonthly = useMemo(() => {
    const n = Object.values(selectedLearning).filter(Boolean).length;
    return Math.round(n * LEARNING_ADDON_PRICE_MONTHLY * 100) / 100;
  }, [selectedLearning]);

  const skinsOneTime = useMemo(() => {
    const n = Object.values(purchasedSkins).filter(Boolean).length;
    return Math.round(n * SKIN_PRICE_ONE_TIME * 100) / 100;
  }, [purchasedSkins]);

  /*__SS_ADDONS_TOTALS__*/
`
  );

  // Modifier totalMonthly: baseMonthly + upsellMonthly + learningMonthly
  t = t.replace(
    /let t = baseMonthly \+ upsellMonthly;/,
    'let t = baseMonthly + upsellMonthly + learningMonthly;'
  );

  // Ajouter totalDueToday (abonnement facturé aujourd’hui + achats uniques)
  // On le place après totalMonthly useMemo
  t = t.replace(
    /const totalMonthly = useMemo\([\s\S]*?\);\n/s,
    (m) => m +
`
  const totalDueToday = useMemo(() => {
    const recurring = totalMonthly; // €/mois affiché (après remises éventuelles)
    const recurringCharge = duration === "annual" ? recurring * 12 : recurring;
    const t = recurringCharge + skinsOneTime;
    return Math.round(t * 100) / 100;
  }, [totalMonthly, duration, skinsOneTime]);
`
  );

  return t;
});

// 4) Checkout: ajouter learning + skins achetés dans les params
ensureOnce('/*__SS_ADDONS_CHECKOUT__*/', (t) => {
  return t.replace(
    /if \(ups\) params\.set\("upsells", ups\);\n\n\s*params\.set\("theme", themePack\);\n\s*params\.set\("skin", skin\);\n/s,
    (m) =>
`if (ups) params.set("upsells", ups);

    const learn = Object.entries(selectedLearning).filter(([,v]) => v).map(([k]) => k).join(",");
    if (learn) params.set("learning", learn);

    const skins = Object.entries(purchasedSkins).filter(([,v]) => v).map(([k]) => k).join(",");
    if (skins) params.set("skins", skins);

    params.set("theme", themePack);
    params.set("skin", skin);

    /*__SS_ADDONS_CHECKOUT__*/\n`
  );
});

// 5) UI: injecter 2 panneaux simples sous les tabs (themes + learning)
ensureOnce('/*__SS_ADDONS_UI__*/', (t) => {
  const rx = /\/\*\s*Tabs\s*\*\/[\s\S]*?<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2">[\s\S]*?<\/div>\n/s;
  const m = t.match(rx);
  if (!m) {
    console.error('❌ Bloc Tabs introuvable: injection UI impossible automatiquement.');
    process.exit(1);
  }
  const block = m[0];

  if (block.includes('/*__SS_ADDONS_UI__*/')) return t;

  const inject =
`
        {/*__SS_ADDONS_UI__*/}
        {tab === "themes" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Skins (achat unique)</div>
              <div className="mt-1 text-sm text-slate-600">
                Un skin acheté est disponible définitivement. Prix: {money(SKIN_PRICE_ONE_TIME)} / skin.
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(["neon","solaire","pastel"] as const).map((k) => (
                  <div key={k} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        className={cn("text-sm font-semibold", skin === k ? "text-slate-900" : "text-slate-700")}
                        onClick={() => setSkin(k)}
                        type="button"
                      >
                        Skin {k}
                      </button>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={!!purchasedSkins[k]}
                          onChange={() => setPurchasedSkins((p) => ({ ...p, [k]: !p[k] }))}
                        />
                        Acheter ({money(SKIN_PRICE_ONE_TIME)})
                      </label>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Actif: {skin === k ? "oui" : "non"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap achat unique</div>
              <div className="mt-3 text-sm text-slate-700">
                Skins achetés:
                <div className="mt-1 text-slate-600">
                  {Object.entries(purchasedSkins).filter(([,v]) => v).map(([k]) => k).join(", ") || "—"}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                Total skins (unique): <span className="font-semibold">{money(skinsOneTime)}</span>
              </div>
            </aside>
          </div>
        ) : null}

        {tab === "learning" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Modes d’apprentissage (abonnement)</div>
              <div className="mt-1 text-sm text-slate-600">
                {money(LEARNING_ADDON_PRICE_MONTHLY)} / mois / mode. Renouvellement mensuel (ou annuel si Annuel).
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {LEARNING_ADDONS.map((a) => (
                  <label key={a.key} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                    <input
                      type="checkbox"
                      checked={!!selectedLearning[a.key]}
                      onChange={() => setSelectedLearning((p) => ({ ...p, [a.key]: !p[a.key] }))}
                    />
                    <div>
                      <div className="text-sm font-semibold">{a.label}</div>
                      <div className="text-xs text-slate-600">{a.desc}</div>
                    </div>
                    <div className="ml-auto text-sm font-semibold">{money(LEARNING_ADDON_PRICE_MONTHLY)}/mois</div>
                  </label>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold">Récap abonnement</div>
              <div className="mt-3 text-sm text-slate-700">
                Modes choisis:
                <div className="mt-1 text-slate-600">
                  {Object.entries(selectedLearning).filter(([,v]) => v).map(([k]) => k.toUpperCase()).join(", ") || "—"}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                Total modes (€/mois): <span className="font-semibold">{money(learningMonthly)}</span>
              </div>
            </aside>
          </div>
        ) : null}
`
  return t.replace(block, block + inject);
});

// 6) Afficher un “Total aujourd’hui” dans le récap (on injecte près du total mensuel existant)
// On cherche un endroit fréquent: l’UI affiche généralement totalMonthly en sticky summary.
// Si on ne trouve pas, on ajoute un petit bandeau juste avant le bouton checkout.
ensureOnce('/*__SS_ADDONS_TOTALTODAY_UI__*/', (t) => {
  if (t.includes('totalDueToday')) {
    // Injecter un bloc avant "checkout();" bouton: on cible 'onClick={checkout}'
    const rxBtn = /<button[^>]*onClick=\{checkout\}[\s\S]*?<\/button>/m;
    if (rxBtn.test(t) && !t.includes('/*__SS_ADDONS_TOTALTODAY_UI__*/')) {
      return t.replace(rxBtn, (m) =>
`<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
  <div className="text-xs text-slate-500">Total aujourd’hui</div>
  <div className="mt-1 flex items-baseline justify-between gap-3">
    <div className="text-sm text-slate-600">
      {duration === "annual" ? "Abonnement annuel (12 mois) + achats uniques" : "Abonnement mensuel + achats uniques"}
    </div>
    <div className="text-xl font-semibold">{money(totalDueToday)}</div>
  </div>
  <div className="mt-1 text-xs text-slate-500">
    Achats uniques (skins): {money(skinsOneTime)} — Options abonnement (modes): {money(learningMonthly)}/mois
  </div>
</div>

${m}
<!-- /*__SS_ADDONS_TOTALTODAY_UI__*/ -->`
      );
    }
  }
  return t;
});

fs.writeFileSync(file, s, 'utf8');
console.log('✅ Patch panier add-ons appliqué:', file);
