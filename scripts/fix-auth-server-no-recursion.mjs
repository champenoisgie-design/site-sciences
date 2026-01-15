import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const serverPath = "src/lib/auth/server.ts";

function exists(p){ return fs.existsSync(path.join(ROOT,p)); }
function read(p){ return fs.readFileSync(path.join(ROOT,p), "utf8"); }
function write(p,s){
  const abs = path.join(ROOT,p);
  fs.mkdirSync(path.dirname(abs), { recursive:true });
  fs.writeFileSync(abs, s, "utf8");
}

if (!exists(serverPath)) throw new Error("Missing src/lib/auth/server.ts");

// Candidate files EXCLUDING server.ts to avoid recursion
const candidates = [
  "src/lib/auth.ts",
  "src/lib/auth/index.ts",
  "src/lib/auth/client.ts",
  "src/lib/auth/helpers.ts",
].filter(exists);

const authDir = path.join(ROOT, "src/lib/auth");
if (fs.existsSync(authDir)) {
  for (const f of fs.readdirSync(authDir)) {
    if (!f.endsWith(".ts")) continue;
    if (f === "server.ts") continue; // critical: exclude
    if (f.endsWith(".bak")) continue;
    candidates.push(`src/lib/auth/${f}`);
  }
}

function findExport(fnNames){
  for (const file of candidates) {
    const t = read(file);
    for (const fn of fnNames) {
      const re1 = new RegExp(`export\\s+async\\s+function\\s+${fn}\\b`, "m");
      const re2 = new RegExp(`export\\s+function\\s+${fn}\\b`, "m");
      const re3 = new RegExp(`export\\s*\\{[^\\}]*\\b${fn}\\b`, "m");
      if (re1.test(t) || re2.test(t) || re3.test(t)) return { file, fn };
    }
  }
  return null;
}

const found = findExport(["getUserFromSession"]);
if (!found) {
  console.error("Scanned candidates:", candidates);
  throw new Error("Could not find an exported getUserFromSession() outside auth/server.ts.");
}

function toAlias(file){
  // src/lib/x.ts -> @/lib/x
  return file.replace(/^src\//, "@/").replace(/\.ts$/, "");
}

const importFrom = toAlias(found.file);

const newServer = `import { getUserFromSession as _getUserFromSession } from "${importFrom}";

/**
 * Server-only wrapper used by API routes / RSC.
 * Source of truth: getUserFromSession from ${importFrom}
 */
export async function getUserFromSessionServer() {
  return _getUserFromSession();
}
`;

write(serverPath, newServer);

console.log("✅ Fixed auth/server.ts to wrap getUserFromSession()");
console.log("   Importing from:", importFrom);
