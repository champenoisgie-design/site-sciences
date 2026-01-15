const fs = require("fs");

const file = "src/app/panier/page.tsx";
let s = fs.readFileSync(file, "utf8");

// 1) Supprimer le marqueur affiché (injecté comme texte)
s = s.replaceAll("/*__SS_RIGHT_RECAP_UI__*/", "");

// 2) Éviter la casse de mots dans le récap (souvent causé par break-all)
s = s.replace(/\bbreak-all\b/g, "");

// 3) Forcer "Rappel" à ne pas se couper (si présent comme texte dans un <div>/<span>)
//
// On remplace uniquement les occurrences simples "Rappel" qui ne sont pas déjà wrap dans nowrap.
if (!s.includes("whitespace-nowrap") && s.includes("Rappel")) {
  // Essai: si on trouve un tag qui contient juste "Rappel"
  s = s.replace(
    /(>)(\s*Rappel\s*)(<)/g,
    `$1<span className="whitespace-nowrap">Rappel</span>$3`
  );
}

fs.writeFileSync(file, s, "utf8");
console.log("✅ Fix appliqué: suppression du marqueur + Rappel non-cassable + nettoyage break-all");
