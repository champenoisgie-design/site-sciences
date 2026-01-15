import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, s) => fs.writeFileSync(abs(p), s, "utf8");

function fixGitignore() {
  const p = ".gitignore";
  if (!exists(p)) {
    console.log("⚠️ .gitignore absent, skip");
    return;
  }
  const before = read(p).split("\n");

  // rg te dit précisément : lines 26, 31, 32 (et le contenu ressemble à BEGIN{... et { } seuls)
  // => on commente ces lignes si elles contiennent des patterns typiquement invalides
  const bad = (line) =>
    line.includes("BEGIN{") ||
    line.trim() === "{" ||
    line.trim() === "}" ||
    /^\s*[\{\}]\s*$/.test(line);

  let changed = false;
  const after = before.map((line) => {
    if (bad(line) && !line.trim().startsWith("#")) {
      changed = true;
      return "# [auto-commented: invalid glob] " + line;
    }
    return line;
  });

  if (changed) {
    write(p, after.join("\n"));
    console.log("✅ .gitignore corrigé (lignes invalides commentées)");
  } else {
    console.log("✅ .gitignore OK (rien à corriger détecté)");
  }
}

function patchRouteFile(file) {
  if (!exists(file)) {
    console.log("⚠️ Missing, skipped:", file);
    return;
  }
  let src = read(file);

  if (!src.includes(`from "@/lib/parentPinGuard"`)) {
    // insert import after last import
    const lines = src.split("\n");
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import ")) lastImport = i;
    }
    const importLine = `import { requireParentPinUnlocked } from "@/lib/parentPinGuard";`;
    if (lastImport >= 0) lines.splice(lastImport + 1, 0, importLine);
    else lines.unshift(importLine);
    src = lines.join("\n");
  }

  // helper to inject guard in handler (GET or POST)
  function inject(fnName) {
    const re = new RegExp(`export\\s+async\\s+function\\s+${fnName}\\s*\\([^\\)]*\\)\\s*\\{\\s*\\n`, "m");
    if (!re.test(src)) return false;

    // already injected?
    if (src.includes("await requireParentPinUnlocked()")) return false;

    src = src.replace(re, (m) => {
      return (
        m +
        `  // Parents PIN required before checkout\n` +
        `  try {\n` +
        `    await requireParentPinUnlocked();\n` +
        `  } catch (e: any) {\n` +
        `    if (e?.code === "PARENT_PIN_REQUIRED" || e?.message === "PARENT_PIN_REQUIRED") {\n` +
        `      return new Response(JSON.stringify({ error: "PARENT_PIN_REQUIRED" }), {\n` +
        `        status: 403,\n` +
        `        headers: { "Content-Type": "application/json" },\n` +
        `      });\n` +
        `    }\n` +
        `    throw e;\n` +
        `  }\n\n`
      );
    });
    return true;
  }

  const changed = inject("POST") || inject("GET");

  if (changed) {
    write(file, src);
    console.log("✅ Guard PIN ajouté:", file);
  } else {
    console.log("ℹ️ Aucun patch appliqué (déjà OK ou handler non trouvé):", file);
  }
}

function main() {
  fixGitignore();

  const targets = [
    "src/app/api/checkout/session/route.ts",
    "src/app/api/checkout/route.ts",
    "src/app/api/billing/checkout-oneoff/route.ts",
  ];

  for (const f of targets) patchRouteFile(f);

  console.log("✅ Done.");
}

main();
