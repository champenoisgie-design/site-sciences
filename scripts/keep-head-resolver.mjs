import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) process.exit(0);

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  if (!src.includes("<<<<<<<")) continue;

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

      out.push(...a);
      continue;
    }

    out.push(L);
    i++;
  }

  const fixed = out.join("\n");

  // Si c'est un JSON, vérifie la validité
  if (/\.(json)$/i.test(f)) {
    try { JSON.parse(fixed); }
    catch (e) {
      console.error(`❌ ${f} reste invalide (JSON). Vérifie manuellement.`);
      process.exitCode = 1;
      continue;
    }
  }

  fs.writeFileSync(f, fixed);
  console.log(`✅ Conflit résolu: ${f}`);
}
