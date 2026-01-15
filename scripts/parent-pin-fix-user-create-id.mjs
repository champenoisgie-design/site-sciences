import fs from "fs";
import path from "path";

const ROOT = process.cwd();
function p(x){ return path.join(ROOT, x); }
function read(f){ return fs.readFileSync(p(f), "utf8"); }
function write(f, s){
  fs.mkdirSync(path.dirname(p(f)), { recursive: true });
  fs.writeFileSync(p(f), s, "utf8");
}
function exists(f){ return fs.existsSync(p(f)); }

const files = [
  "src/app/api/parent-pin/set/route.ts",
  "src/app/api/parent-pin/verify/route.ts",
];

for (const f of files) if (!exists(f)) throw new Error(`Missing ${f}`);

function ensureCryptoImport(src){
  // only if ensureDbUser exists and crypto not imported
  if (!src.includes("function ensureDbUser")) return src;
  if (src.includes(`from "crypto"`)) return src;

  // insert after other imports
  const lines = src.split("\n");
  let lastImportIdx = -1;
  for (let i=0;i<lines.length;i++){
    if (lines[i].startsWith("import ")) lastImportIdx = i;
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx+1, 0, `import crypto from "crypto";`);
    return lines.join("\n");
  }
  return `import crypto from "crypto";\n` + src;
}

function patchCreateBlock(src){
  if (!src.includes("function ensureDbUser")) return src;

  // Replace the prisma.user.create({ data: { ... } }) inside ensureDbUser
  // We look for "return prisma.user.create({" followed by "data: {"
  const re = /return\s+prisma\.user\.create\(\{\s*data:\s*\{([\s\S]*?)\}\s*\}\s*\);\s*/m;
  const m = src.match(re);
  if (!m) return src;

  const inside = m[1];

  // If id already present, nothing to do
  if (inside.includes("id:")) return src;

  const newInside = `\n      id: user.id ?? crypto.randomUUID(),` + inside;

  const replaced = src.replace(re, (full) => {
    return full.replace(inside, newInside);
  });

  return replaced;
}

for (const f of files) {
  let src = read(f);
  src = ensureCryptoImport(src);
  src = patchCreateBlock(src);
  write(f, src);
}

console.log("✅ Patched ensureDbUser() to include id on user.create().");
