import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const candidates = [
  "src/app/compte/page.tsx",
  "src/app/account/page.tsx",
];

function exists(p){ return fs.existsSync(path.join(ROOT,p)); }
function read(p){ return fs.readFileSync(path.join(ROOT,p),"utf8"); }
function write(p,s){ fs.writeFileSync(path.join(ROOT,p), s, "utf8"); }

const file = candidates.find(exists);
if (!file) {
  console.log("❌ Aucun fichier Mon compte trouvé:", candidates);
  process.exit(1);
}

let src = read(file);
const backup = file + ".bak.pin." + Date.now();
write(backup, src);
console.log("✅ Backup:", backup);

if (!src.includes('RequireParentPinAlways')) {
  // add import after last import
  const lines = src.split("\n");
  let lastImport = -1;
  for (let i=0;i<lines.length;i++) if (lines[i].startsWith("import ")) lastImport = i;
  const imp = `import { RequireParentPinAlways } from "@/components/parent-pin/RequireParentPinAlways";`;
  if (lastImport >= 0) lines.splice(lastImport+1, 0, imp);
  else lines.unshift(imp);
  src = lines.join("\n");
}

function wrapSection(keyword) {
  // Heuristique: si on trouve un bloc JSX qui contient le mot, on entoure par <RequireParentPinAlways>
  // On fait simple: wrap autour de la première occurrence d'un heading/label.
  const idx = src.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return false;

  // Wrap sur le return global: on ne veut PAS ça.
  // Donc on essaie de repérer une section type <section>...</section> ou <div>...</div> autour.
  // Heuristique: remonter au dernier "<section" ou "<div" avant idx
  const before = src.slice(0, idx);
  const start = Math.max(before.lastIndexOf("<section"), before.lastIndexOf("<div"));
  if (start === -1) return false;

  // Trouver la fin du tag ouvert (>)
  const openEnd = src.indexOf(">", start);
  if (openEnd === -1) return false;

  // Trouver le tag fermant correspondant </section> ou </div> le plus proche après idx
  const tag = src.slice(start, openEnd+1).startsWith("<section") ? "section" : "div";
  const closeTag = `</${tag}>`;
  const end = src.indexOf(closeTag, idx);
  if (end === -1) return false;

  const inner = src.slice(start, end + closeTag.length);
  if (inner.includes("<RequireParentPinAlways>")) return true;

  const wrapped = `<RequireParentPinAlways>\n${inner}\n</RequireParentPinAlways>`;
  src = src.slice(0, start) + wrapped + src.slice(end + closeTag.length);
  return true;
}

const didSub = wrapSection("abonnement");
const didParents = wrapSection("parents");

write(file, src);
console.log("✅ Patched:", file, { abonnement: didSub, parents: didParents });

if (!didSub || !didParents) {
  console.log("⚠️ Attention: je n'ai pas réussi à wrapper automatiquement une/des sections.");
  console.log("   Ouvre le fichier et repère la zone Abonnement/Parents, on patchera au bon endroit.");
}
