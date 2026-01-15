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

// Collect files to scan
const files = [];
if (exists("src/lib/auth.ts")) files.push("src/lib/auth.ts");

const authDir = path.join(ROOT, "src/lib/auth");
if (fs.existsSync(authDir)) {
  for (const f of fs.readdirSync(authDir)) {
    if (!f.endsWith(".ts")) continue;
    if (f === "server.ts") continue;      // avoid recursion
    if (f.endsWith(".bak")) continue;
    files.push(`src/lib/auth/${f}`);
  }
}
if (files.length === 0) throw new Error("No auth files found to scan.");

// Extract exported function names (simple parser)
function exportedNames(text){
  const out = new Set();

  // export function foo() / export async function foo()
  for (const m of text.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(/g)) {
    out.add(m[1]);
  }

  // export const foo = (...) => ...
  for (const m of text.matchAll(/export\s+const\s+([A-Za-z0-9_]+)\s*=/g)) {
    out.add(m[1]);
  }

  // export { a, b as c }
  for (const m of text.matchAll(/export\s*\{\s*([^}]+)\s*\}/g)) {
    const parts = m[1].split(",").map(s => s.trim()).filter(Boolean);
    for (const p of parts) {
      // handle "a as b"
      const name = p.split(/\s+as\s+/i).pop()?.trim();
      if (name) out.add(name);
    }
  }

  return [...out];
}

const all = [];
for (const f of files) {
  const t = read(f);
  const names = exportedNames(t);
  all.push({ file: f, names });
}

console.log("== Exported names found ==");
for (const x of all) {
  console.log("-", x.file, ":", x.names.join(", ") || "(none)");
}

// Priority list: the earlier, the better
const preferred = [
  "getUserFromSession",
  "getUserFromSessionServer",
  "userFromSessionServer",
  "fromSessionServer",
  "getUserFromSessionCookie",
  "getUserFromSessionToken",
  "getCurrentUser",
  "getUser",
  "requireUser",
];

let found = null;
for (const name of preferred) {
  for (const x of all) {
    if (x.names.includes(name)) {
      found = { name, file: x.file };
      break;
    }
  }
  if (found) break;
}

if (!found) {
  throw new Error("Could not find a suitable exported auth helper. Check the printed exports above.");
}

function toAlias(file){
  return file.replace(/^src\//, "@/").replace(/\.ts$/, "");
}

const importFrom = toAlias(found.file);

// Write wrapper WITHOUT recursion (never import from "@/lib/auth/server")
const newServer = `import { ${found.name} as _getUser } from "${importFrom}";

/**
 * Server-only wrapper used by API routes / RSC.
 * Source of truth: ${found.name} from ${importFrom}
 */
export async function getUserFromSessionServer() {
  return _getUser();
}
`;

write(serverPath, newServer);

console.log("✅ Rewrote src/lib/auth/server.ts");
console.log("   Wrapping:", found.name, "from", importFrom);
