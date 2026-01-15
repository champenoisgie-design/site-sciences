import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function exists(p){ return fs.existsSync(path.join(ROOT,p)); }
function read(p){ return fs.readFileSync(path.join(ROOT,p), "utf8"); }
function write(p,s){
  const abs = path.join(ROOT,p);
  fs.mkdirSync(path.dirname(abs), { recursive:true });
  fs.writeFileSync(abs, s, "utf8");
}

const serverPath = "src/lib/auth/server.ts";
if (!exists(serverPath)) throw new Error("Missing src/lib/auth/server.ts");

const candidates = [
  "src/lib/auth.ts",
  "src/lib/auth/index.ts",
  "src/lib/auth/server.ts", // for completeness, but we patch this
  "src/lib/auth/client.ts",
  "src/lib/auth/helpers.ts",
];

const existing = candidates.filter(exists);

// Also scan src/lib/auth directory if present
const authDir = path.join(ROOT, "src/lib/auth");
if (fs.existsSync(authDir)) {
  for (const f of fs.readdirSync(authDir)) {
    if (f.endsWith(".ts") && !f.endsWith(".bak")) {
      existing.push(`src/lib/auth/${f}`);
    }
  }
}

function findExportedFunction(fnNameList) {
  for (const file of existing) {
    const t = read(file);
    for (const fn of fnNameList) {
      const re1 = new RegExp(`export\\s+async\\s+function\\s+${fn}\\b`, "m");
      const re2 = new RegExp(`export\\s+function\\s+${fn}\\b`, "m");
      const re3 = new RegExp(`export\\s*\\{[^\\}]*\\b${fn}\\b`, "m");
      if (re1.test(t) || re2.test(t) || re3.test(t)) {
        return { file, fn };
      }
    }
  }
  return null;
}

// The “source of truth” function names we accept
const want = ["getUserFromSession", "getUserFromSessionServer", "userFromSessionServer", "fromSessionServer"];

const found = findExportedFunction(want);
if (!found) {
  console.error("Scanned files:", existing);
  throw new Error("Could not find any exported session user helper (getUserFromSession / ...).");
}

// Map file path to import alias
function toAlias(file) {
  // convert src/lib/x.ts -> @/lib/x
  if (!file.startsWith("src/")) throw new Error("Unexpected path: " + file);
  const noExt = file.replace(/^src\//, "@/").replace(/\.ts$/, "");
  return noExt;
}

const importFrom = toAlias(found.file);
const serverSrc = read(serverPath);

// We will rewrite server.ts to be a thin wrapper with a stable name:
// export async function getUserFromSessionServer() { ... }
const newServer = `import { ${found.fn} as _getUserFromSession } from "${importFrom}";

/**
 * Server-only wrapper used by API routes / RSC.
 * Source of truth: ${found.fn} from ${importFrom}
 */
export async function getUserFromSessionServer() {
  return _getUserFromSession();
}
`;

write(serverPath, newServer);

console.log("✅ Patched src/lib/auth/server.ts");
console.log("   Using:", found.fn, "from", importFrom);
