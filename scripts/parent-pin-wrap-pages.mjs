import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(abs(p)), { recursive: true }); fs.writeFileSync(abs(p), s, "utf8"); };

const targets = [
  { file: "src/app/parents/page.tsx", title: "Espace Parents", desc: "PIN requis pour accéder au récapitulatif parents." },
  { file: "src/app/abonnement/page.tsx", title: "Abonnement", desc: "PIN requis pour modifier ou consulter l’abonnement." },
];

for (const t of targets) {
  if (!exists(t.file)) {
    console.log("⚠️ Missing, skipped:", t.file);
    continue;
  }

  let src = read(t.file);

  // Add import if missing
  if (!src.includes('ParentPinGate')) {
    // Insert after last import
    const lines = src.split("\n");
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) lastImport = i;
    }
    const importLine = `import { ParentPinGate } from "@/components/parent-pin/ParentPinGate";`;
    if (lastImport >= 0) lines.splice(lastImport + 1, 0, importLine);
    else lines.unshift(importLine);
    src = lines.join("\n");
  }

  // Wrap default export JSX return.
  // We patch the first "return (" occurrence only.
  if (!src.includes("<ParentPinGate")) {
    src = src.replace(
      /return\s*\(\s*/m,
      `return (\n    <ParentPinGate title=${JSON.stringify(t.title)} description=${JSON.stringify(t.desc)}>\n`
    );
    // Close wrapper before the matching final ");" for the first return block.
    // Simple approach: insert before last ");" in file.
    const idx = src.lastIndexOf(");");
    if (idx !== -1) {
      src = src.slice(0, idx) + "    </ParentPinGate>\n" + src.slice(idx);
    } else {
      console.log("⚠️ Could not find closing ');' in", t.file, "=> manual check needed.");
    }
  }

  write(t.file, src);
  console.log("✅ Wrapped with ParentPinGate:", t.file);
}

console.log("✅ Done.");
