import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(abs(p)), { recursive: true }); fs.writeFileSync(abs(p), s, "utf8"); };

const sessionIdFile = "src/lib/auth/sessionId.ts";
if (!exists(sessionIdFile)) throw new Error(`Missing ${sessionIdFile}`);

let sid = read(sessionIdFile);

// Replace with a robust async implementation (overwrite fully to avoid edge cases)
sid = `import { cookies } from "next/headers";

/**
 * Next.js 15: cookies() is async in route handlers / server contexts.
 * We return a stable session id based on the HTTP-only cookie.
 *
 * Strategy:
 * 1) try preferred name ("session") first (detected previously)
 * 2) then try any cookie whose name includes "session"
 * 3) fallback: first non-empty cookie value
 */
export async function getSessionIdFromCookies(): Promise<string> {
  const store = await cookies();

  const preferred = "session";
  const v1 = store.get(preferred)?.value;
  if (v1) return v1;

  const all = store.getAll();
  const byName = all.find(c => /session/i.test(c.name) && c.value);
  if (byName?.value) return byName.value;

  const any = all.find(c => c.value);
  return any?.value ?? "";
}
`;
write(sessionIdFile, sid);
console.log("✅ Patched", sessionIdFile);

// Patch callers to await getSessionIdFromCookies()
const targets = [
  "src/app/api/parent-pin/verify/route.ts",
  "src/app/api/parent-pin/status/route.ts",
  "src/lib/parentPinGuard.ts",
];

for (const f of targets) {
  if (!exists(f)) {
    console.log("⚠️ Missing, skipped:", f);
    continue;
  }
  let src = read(f);

  // If it already uses await, skip minimal changes
  // Replace: const sessionId = getSessionIdFromCookies();
  src = src.replace(
    /const\s+sessionId\s*=\s*getSessionIdFromCookies\(\)\s*;/g,
    "const sessionId = await getSessionIdFromCookies();"
  );

  // If function is not async but now has await, make it async (for route handlers)
  // verify route: export async function POST already async, status GET already async
  // guard functions are async already in our earlier code; if not, keep safe:
  src = src.replace(
    /export\s+function\s+isParentPinUnlocked\s*\(/g,
    "export async function isParentPinUnlocked("
  );

  write(f, src);
  console.log("✅ Patched await usage in", f);
}

console.log("✅ Done.");
