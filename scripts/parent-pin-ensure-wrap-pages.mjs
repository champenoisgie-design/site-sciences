import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(abs(p)), { recursive: true });
  fs.writeFileSync(abs(p), s, "utf8");
};

const targets = [
  { file: "src/app/parents/page.tsx", title: "Espace Parents", desc: "PIN requis pour accéder au récapitulatif parents." },
  { file: "src/app/abonnement/page.tsx", title: "Abonnement", desc: "PIN requis pour modifier ou consulter l’abonnement." },
];

function ensureImport(src) {
  if (src.includes(`from "@/components/parent-pin/ParentPinGate"`)) return src;

  const importLine = `import { ParentPinGate } from "@/components/parent-pin/ParentPinGate";`;
  const lines = src.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith("import ")) lastImport = i;
  if (lastImport >= 0) lines.splice(lastImport + 1, 0, importLine);
  else lines.unshift(importLine);
  return lines.join("\n");
}

function wrapReturn(src, t) {
  if (src.includes("<ParentPinGate")) return { src, changed: false };

  // Cas 1: return ( ... )
  if (/return\s*\(\s*/m.test(src)) {
    let out = src.replace(
      /return\s*\(\s*/m,
      `return (\n    <ParentPinGate title=${JSON.stringify(t.title)} description=${JSON.stringify(t.desc)}>\n`
    );
    const idx = out.lastIndexOf(");");
    if (idx !== -1) {
      out = out.slice(0, idx) + "    </ParentPinGate>\n" + out.slice(idx);
      return { src: out, changed: true };
    }
    return { src, changed: false };
  }

  // Cas 2: return <JSX />;  (sans parenthèses)
  // On transforme en return (<ParentPinGate> <JSX /> </ParentPinGate>);
  const m = src.match(/return\s+<([\s\S]*?)>\s*;?/m);
  if (m) {
    // heuristique plus robuste: attraper "return <" jusqu'au premier ";" de la ligne return
    const lineRe = /return\s+<[\s\S]*?;\s*/m;
    const lm = src.match(lineRe);
    if (lm) {
      const returnStmt = lm[0];
      const jsx = returnStmt.replace(/^return\s+/, "").replace(/;\s*$/, "").trim();
      const wrapped =
        `return (\n` +
        `    <ParentPinGate title=${JSON.stringify(t.title)} description=${JSON.stringify(t.desc)}>\n` +
        `      ${jsx}\n` +
        `    </ParentPinGate>\n` +
        `  );\n`;
      const out = src.replace(returnStmt, wrapped);
      return { src: out, changed: true };
    }
  }

  return { src, changed: false };
}

for (const t of targets) {
  if (!exists(t.file)) {
    console.log("⚠️ Missing, skipped:", t.file);
    continue;
  }
  let src = read(t.file);

  src = ensureImport(src);
  const r = wrapReturn(src, t);
  src = r.src;

  write(t.file, src);
  console.log(`✅ ${t.file}: wrap=${r.changed ? "APPLIED" : "already/skip"}`);
}

console.log("✅ Done.");
