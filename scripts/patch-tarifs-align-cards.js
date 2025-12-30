const fs = require("fs");

const file = "src/app/tarifs/page.tsx";
let s = fs.readFileSync(file, "utf8");

function must(rx, label) {
  if (!rx.test(s)) {
    console.error("❌ Introuvable:", label);
    process.exit(1);
  }
}

// A) Condenser bullets Gold (3 bullets)
must(/key:\s*"gold"[\s\S]*?bullets:\s*\[[\s\S]*?\]/m, "plan gold bullets");
s = s.replace(
  /(\{\s*key:\s*"gold"[\s\S]*?bullets:\s*)\[[\s\S]*?\](\s*,\s*cta:\s*"Choisir Gold")/m,
  `$1[
          "Parents inclus (tableau + suivi)",
          "Révision intelligente + stats & corrections expliquées",
          "Indices guidés + objectifs avancés + sauvegarde session",
        ]$2`
);

// B) Carte: flex-col + h-full
must(/"rounded-2xl border bg-white p-6 shadow-\[0_1px_0_0_rgba\(0,0,0,0\.02\)\]"/m, "card base class");
s = s.replace(
  /"rounded-2xl border bg-white p-6 shadow-\[0_1px_0_0_rgba\(0,0,0,0\.02\)\]"/g,
  `"rounded-2xl border bg-white p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] flex flex-col h-full"`
);

// C) CTA collé en bas
s = s.replace(
  /"mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold"/g,
  `"mt-auto w-full rounded-xl px-4 py-3 text-sm font-semibold"`
);

// D) Liste bullets hauteur mini (stabilise)
must(/<ul className="mt-4 space-y-2 text-sm text-slate-700">/m, "ul bullets");
s = s.replace(
  /<ul className="mt-4 space-y-2 text-sm text-slate-700">/g,
  `<ul className="mt-4 space-y-2 text-sm text-slate-700 min-h-[96px]">`
);

fs.writeFileSync(file, s, "utf8");
console.log("✅ Tarifs: cartes alignées + bullets Gold condensés.");
