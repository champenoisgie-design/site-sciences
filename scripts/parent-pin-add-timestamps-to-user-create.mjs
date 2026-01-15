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

function patch(src){
  // Locate user.create({ data: { ... }})
  const idx = src.indexOf("prisma.user.create({");
  if (idx === -1) return { src, patched: false };

  // insert timestamps near id/email if not present
  // We'll add right after the inserted id line if we find it, else after "data: {"
  if (src.includes("updatedAt:")) return { src, patched: false };

  // find the first occurrence of "id:" inside the create data
  const idPos = src.indexOf("id:", idx);
  if (idPos !== -1) {
    // insert after the line containing id:
    const lineEnd = src.indexOf("\n", idPos);
    if (lineEnd !== -1) {
      const lineStart = src.lastIndexOf("\n", idPos) + 1;
      const indent = (src.slice(lineStart, idPos).match(/^\s*/) || [""])[0];

      const insert = `\n${indent}createdAt: new Date(),\n${indent}updatedAt: new Date(),`;
      const out = src.slice(0, lineEnd) + insert + src.slice(lineEnd);
      return { src: out, patched: true };
    }
  }

  // fallback: after "data: {"
  const dataPos = src.indexOf("data:", idx);
  const bracePos = dataPos !== -1 ? src.indexOf("{", dataPos) : -1;
  if (bracePos !== -1) {
    const lineStart = src.lastIndexOf("\n", bracePos) + 1;
    const indent = (src.slice(lineStart, bracePos).match(/^\s*/) || [""])[0] + "  ";
    const insert = `\n${indent}createdAt: new Date(),\n${indent}updatedAt: new Date(),`;
    const out = src.slice(0, bracePos + 1) + insert + src.slice(bracePos + 1);
    return { src: out, patched: true };
  }

  return { src, patched: false };
}

for (const f of files) {
  const before = read(f);
  const { src: after, patched } = patch(before);
  write(f, after);
  console.log(`✅ ${f}: timestamps patched: ${patched}`);
}

console.log("✅ Done.");
