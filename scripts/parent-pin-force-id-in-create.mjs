import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const files = [
  "src/app/api/parent-pin/set/route.ts",
  "src/app/api/parent-pin/verify/route.ts",
];

function abs(p){ return path.join(ROOT, p); }
function read(p){ return fs.readFileSync(abs(p), "utf8"); }
function write(p, s){
  fs.mkdirSync(path.dirname(abs(p)), { recursive: true });
  fs.writeFileSync(abs(p), s, "utf8");
}
function exists(p){ return fs.existsSync(abs(p)); }

for (const f of files) if (!exists(f)) throw new Error(`Missing ${f}`);

function ensureCryptoImport(src){
  if (!src.includes(`crypto`)) {
    // Insert after last import line
    const lines = src.split("\n");
    let lastImport = -1;
    for (let i=0;i<lines.length;i++){
      if (lines[i].startsWith("import ")) lastImport = i;
    }
    if (lastImport >= 0) {
      lines.splice(lastImport+1, 0, `import crypto from "crypto";`);
      return lines.join("\n");
    }
    return `import crypto from "crypto";\n` + src;
  }
  // If crypto word exists but no import from crypto, still add import
  if (!src.includes(`from "crypto"`)) {
    const lines = src.split("\n");
    let lastImport = -1;
    for (let i=0;i<lines.length;i++){
      if (lines[i].startsWith("import ")) lastImport = i;
    }
    if (lastImport >= 0) {
      lines.splice(lastImport+1, 0, `import crypto from "crypto";`);
      return lines.join("\n");
    }
    return `import crypto from "crypto";\n` + src;
  }
  return src;
}

function patchCreates(src){
  const needle = "prisma.user.create({";
  let idx = 0;
  let out = src;
  let patchedCount = 0;

  while (true) {
    const i = out.indexOf(needle, idx);
    if (i === -1) break;

    // Find "data: {" after this create(
    const dataIdx = out.indexOf("data:", i);
    if (dataIdx === -1) { idx = i + needle.length; continue; }

    const braceIdx = out.indexOf("{", dataIdx);
    if (braceIdx === -1) { idx = i + needle.length; continue; }

    // Check if id already present in the first ~200 chars after data {
    const window = out.slice(braceIdx, braceIdx + 250);
    if (/\bid\s*:/.test(window)) {
      idx = braceIdx + 1;
      continue;
    }

    // Insert id line right after data: {
    // Determine indentation from next line
    const lineStart = out.lastIndexOf("\n", braceIdx) + 1;
    const indent = (out.slice(lineStart, braceIdx).match(/^\s*/) || [""])[0] + "  ";

    const insert = `\n${indent}id: user?.id ?? crypto.randomUUID(),`;
    out = out.slice(0, braceIdx + 1) + insert + out.slice(braceIdx + 1);
    patchedCount++;
    idx = braceIdx + 1 + insert.length;
  }

  return { out, patchedCount };
}

for (const f of files) {
  let src = read(f);
  src = ensureCryptoImport(src);

  const { out, patchedCount } = patchCreates(src);
  write(f, out);
  console.log(`✅ ${f}: patched user.create occurrences: ${patchedCount}`);
}

console.log("✅ Done.");
