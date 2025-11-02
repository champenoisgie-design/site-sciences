import fs from "node:fs";

const file = "package.json";
let src = fs.readFileSync(file, "utf8");
if (!src.includes("<<<<<<<")) {
  console.log("✅ Aucun marqueur de conflit détecté.");
  process.exit(0);
}

const lines = src.split(/\r?\n/);
let out = [];
let i = 0;

while (i < lines.length) {
  const L = lines[i];

  if (L.startsWith("<<<<<<<")) {
    // collect side A (HEAD)
    i++;
    let a = [];
    while (i < lines.length && !lines[i].startsWith("=======")) {
      a.push(lines[i]); i++;
    }
    // skip "======="
    if (i < lines.length && lines[i].startsWith("=======")) i++;
    // skip side B until ">>>>>>>"
    while (i < lines.length && !lines[i].startsWith(">>>>>>>")) i++;
    // skip ">>>>>>>"
    if (i < lines.length && lines[i].startsWith(">>>>>>>")) i++;

    // keep side A
    out.push(...a);
    continue;
  }

  out.push(L);
  i++;
}

const fixed = out.join("\n");
try {
  JSON.parse(fixed); // Vérifie que c'est bien du JSON
} catch (e) {
  console.error("❌ package.json reste invalide après nettoyage.");
  console.error("   Vérifie manuellement package.json.bak.* pour restaurer.");
  process.exit(1);
}

fs.writeFileSync(file, fixed);
console.log("✅ Conflits supprimés et JSON valide.");
