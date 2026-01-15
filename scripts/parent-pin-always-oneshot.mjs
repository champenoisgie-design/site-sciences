import fs from "fs";
import path from "path";

function read(p){ return fs.readFileSync(p,"utf8"); }
function write(p,s){ fs.writeFileSync(p,s,"utf8"); }
function exists(p){ return fs.existsSync(p); }

const root = process.cwd();

function patchRoute(filePath) {
  if (!exists(filePath)) return { filePath, skipped: true, reason: "missing" };
  let s = read(filePath);

  // Import guard
  if (!s.includes("requireParentPinOr423") || !s.includes("consumeParentPin")) {
    // try add import near top
    const importLine = `import { requireParentPinOr423, consumeParentPin } from "@/lib/parentPinOneShot";\n`;
    if (s.includes('from "@/lib/parentPinOneShot"')) {
      // already
    } else {
      // insert after first block of imports
      const m = s.match(/(^import[\s\S]*?\n)\n/m);
      if (m) s = s.replace(m[0], m[1] + importLine + "\n");
      else s = importLine + "\n" + s;
    }
  }

  // Need userId/sessionId variables: we assume they exist in your route already.
  // We just inject guard after userId+sessionId computed.
  if (!s.includes("requireParentPinOr423(")) {
    // Find a place after sessionId is determined.
    // Heuristic: after a line containing "sessionId"
    const idx = s.search(/sessionId/);
    if (idx === -1) {
      return { filePath, skipped: true, reason: "no sessionId found - patch manually" };
    }

    // Insert guard near first occurrence of 'sessionId'
    const lines = s.split("\n");
    let insertAt = -1;
    for (let i=0;i<lines.length;i++){
      if (lines[i].includes("sessionId")) { insertAt = i+1; break; }
    }
    if (insertAt === -1) return { filePath, skipped: true, reason: "no insert point" };

    lines.splice(insertAt, 0,
      "",
      "  // Parent PIN guard (ONE-SHOT): require PIN for every protected action",
      "  const gate = await requireParentPinOr423(userId, sessionId);",
      "  if (gate) return gate;",
      ""
    );
    s = lines.join("\n");
  }

  // Consume PIN just before return success (heuristic: before NextResponse.json or return Response)
  if (!s.includes("consumeParentPin(")) {
    s = s.replace(
      /(return\s+(NextResponse\.json|Response\.json)\([\s\S]*?\)\s*;)/m,
      `await consumeParentPin(userId, sessionId);\n\n  $1`
    );
  }

  write(filePath, s);
  return { filePath, patched: true };
}

function patchClientComponent(filePath) {
  if (!exists(filePath)) return { filePath, skipped: true, reason: "missing" };
  let s = read(filePath);

  // Ensure imports
  if (!s.includes("useParentPinModal")) {
    const add = `import { useParentPinModal } from "@/components/parent-pin/useParentPinModal";\nimport { fetchWithParentPinRetry } from "@/components/parent-pin/fetchWithParentPinRetry";\n`;
    // insert after 'use client' and imports
    const m = s.match(/(^['"]use client['"]\s*\n)/);
    if (m) {
      // after 'use client' line
      s = s.replace(m[0], m[0] + add);
    } else {
      // fallback: prepend
      s = `\n${add}\n` + s;
    }
  }

  // Add hook at top-level of component
  if (!s.includes("const { open: openParentPin")) {
    // find function component start: "export default function X(" or "function X("
    const m = s.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{\n/);
    if (m) {
      s = s.replace(
        m[0],
        m[0] + `  const { open: openParentPin, ParentPinModal } = useParentPinModal();\n`
      );
    } else {
      // try arrow component
    }
  }

  // Replace direct fetch("/api/checkout/session"... ) with fetchWithParentPinRetry(..., openParentPin)
  // We do a conservative replace for common patterns.
  s = s.replace(
    /await\s+fetch\(\s*([`'"]\/api\/checkout\/session[`'"])\s*,/g,
    "await fetchWithParentPinRetry($1,"
  );

  // If we replaced, ensure we pass openParentPin as 3rd arg in the call: find "fetchWithParentPinRetry('/api/checkout/session', { ... })"
  s = s.replace(
    /(fetchWithParentPinRetry\(\s*[`'"]\/api\/checkout\/session[`'"]\s*,\s*\{[\s\S]*?\}\s*\))/g,
    "$1, openParentPin)"
  );

  // Add modal rendering before return close
  if (!s.includes("{ParentPinModal}")) {
    // wrap existing return (...) with fragment
    s = s.replace(
      /return\s*\(\s*([\s\S]*?)\s*\);\s*}$/m,
      (full, inner) => {
        // If already fragment, just append
        if (inner.trim().startsWith("<>")) {
          return `return (\n${inner}\n      {ParentPinModal}\n    </>\n  );\n}`;
        }
        return `return (\n    <>\n${inner}\n      {ParentPinModal}\n    </>\n  );\n}`;
      }
    );
  }

  write(filePath, s);
  return { filePath, patched: true };
}

const routes = [
  "src/app/api/checkout/session/route.ts",
  "src/app/api/checkout/route.ts",
  "src/app/api/billing/checkout-oneoff/route.ts",
];

const clients = [
  "src/components/SubscribeButton.tsx",
  "src/components/cart/StickyCheckoutBar.tsx",
  "src/components/checkout/CheckoutDebugButton.tsx",
  "src/components/pricing/ServerTruthBlock.tsx",
];

const out = [];

for (const r of routes) out.push(patchRoute(path.join(root, r)));
for (const c of clients) out.push(patchClientComponent(path.join(root, c)));

console.log("=== parent-pin oneshot patch report ===");
for (const o of out) console.log(o);
