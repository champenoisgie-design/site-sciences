import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(abs(p)), { recursive: true }); fs.writeFileSync(abs(p), s, "utf8"); };

function addGuardToRoute(file) {
  if (!exists(file)) return { file, changed: false, reason: "missing" };
  let src = read(file);

  if (src.includes("requireParentPinUnlocked")) return { file, changed: false, reason: "already" };

  // ensure import
  if (!src.includes('from "@/lib/parentPinGuard"')) {
    // insert after last import
    const lines = src.split("\n");
    let lastImport = -1;
    for (let i=0;i<lines.length;i++) if (lines[i].startsWith("import ")) lastImport = i;
    const importLine = `import { requireParentPinUnlocked } from "@/lib/parentPinGuard";`;
    if (lastImport >= 0) lines.splice(lastImport+1, 0, importLine);
    else lines.unshift(importLine);
    src = lines.join("\n");
  }

  // insert call at start of POST/GET handler
  src = src.replace(
    /export\s+async\s+function\s+(POST|GET)\s*\([^\)]*\)\s*\{\s*\n/,
    (m) => `${m}  // Parents PIN required\n  await requireParentPinUnlocked();\n\n`
  );

  write(file, src);
  return { file, changed: true, reason: "patched" };
}

// 1) Guard sur les routes checkout existantes (d’après tes résultats)
const routesToGuard = [
  "src/app/api/checkout/session/route.ts",
  "src/app/api/checkout/route.ts",
  "src/app/api/billing/checkout-oneoff/route.ts",
];

const guardResults = routesToGuard.map(addGuardToRoute);

// 2) Helper UI: retry sur 403 PARENT_PIN_REQUIRED
write("src/components/parent-pin/withParentPinRetry.tsx", `"use client";

import * as React from "react";
import { ParentPinModal } from "./ParentPinModal";

export function useParentPinRetry() {
  const [open, setOpen] = React.useState(false);
  const resolverRef = React.useRef<null | (() => void)>(null);

  function promptPin(): Promise<void> {
    setOpen(true);
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }

  function close() {
    setOpen(false);
  }

  function onVerified() {
    const r = resolverRef.current;
    resolverRef.current = null;
    setOpen(false);
    r?.();
  }

  const modal = (
    <ParentPinModal
      open={open}
      onClose={() => {
        resolverRef.current = null;
        setOpen(false);
      }}
      onVerified={() => onVerified()}
    />
  );

  return { promptPin, modal };
}

export async function fetchWithParentPinRetry(
  promptPin: () => Promise<void>,
  input: RequestInfo | URL,
  init?: RequestInit,
  retryOnce: boolean = true
) {
  const res = await fetch(input, init);
  if (res.status !== 403) return res;

  const txt = await res.clone().text().catch(() => "");
  let err = "";
  try { err = JSON.parse(txt)?.error; } catch {}
  if (err !== "PARENT_PIN_REQUIRED") return res;

  if (!retryOnce) return res;

  await promptPin();
  return fetch(input, init);
}
`);

// 3) Patch composants checkout pour ouvrir la modale automatiquement
function patchClientFile(file, patterns) {
  if (!exists(file)) return { file, changed: false, reason: "missing" };
  let src = read(file);
  let changed = false;

  // add imports
  if (!src.includes('from "@/components/parent-pin/withParentPinRetry"')) {
    const lines = src.split("\n");
    let lastImport = -1;
    for (let i=0;i<lines.length;i++) if (lines[i].startsWith("import ")) lastImport = i;
    const importLine = `import { useParentPinRetry, fetchWithParentPinRetry } from "@/components/parent-pin/withParentPinRetry";`;
    if (lastImport >= 0) lines.splice(lastImport+1, 0, importLine);
    else lines.unshift(importLine);
    src = lines.join("\n");
    changed = true;
  }

  // inject hook + modal rendering once (best-effort)
  if (!src.includes("useParentPinRetry()")) {
    // after component function start: look for "function X(" or "export default function"
    src = src.replace(
      /(export\s+default\s+function\s+\w+\s*\([^\)]*\)\s*\{\s*\n|function\s+\w+\s*\([^\)]*\)\s*\{\s*\n)/,
      (m) => `${m}  const { promptPin, modal: parentPinModal } = useParentPinRetry();\n`
    );
    changed = true;
  }

  // replace plain fetch("/api/checkout/session"... ) to fetchWithParentPinRetry(promptPin,...)
  for (const p of patterns) {
    if (src.includes(p.plain) && !src.includes(p.replacedNeedle)) {
      src = src.replaceAll(p.plain, p.replaced);
      changed = true;
    }
  }

  // ensure modal is rendered in JSX (best-effort: inject before last </...> root return)
  if (!src.includes("{parentPinModal}") && src.includes("parentPinModal")) {
    // naive: put it just before last closing tag of return block by inserting before last "\n}"
    const idx = src.lastIndexOf("\n}");
    if (idx !== -1) {
      src = src.slice(0, idx) + `\n  return (\n    <>\n      {parentPinModal}\n` + src.slice(idx);
      // this is too risky if file already has return; so do safer: only if file has "return (" and no fragment wrapper
      // rollback if it looks wrong
      changed = changed; // no-op
    }
  }

  // Safer: if file already has a return fragment, just insert `{parentPinModal}` after first "return ("
  if (!src.includes("{parentPinModal}") && src.includes("return (")) {
    src = src.replace("return (", "return (\n    <>\n      {parentPinModal}");
    // close fragment before last ");"
    const end = src.lastIndexOf(");");
    if (end !== -1) src = src.slice(0, end) + "\n    </>\n" + src.slice(end);
    changed = true;
  }

  write(file, src);
  return { file, changed, reason: changed ? "patched" : "nochange" };
}

const patterns = [
  {
    plain: 'fetch("/api/checkout/session"',
    replacedNeedle: "fetchWithParentPinRetry",
    replaced: 'fetchWithParentPinRetry(promptPin, "/api/checkout/session"',
  },
  {
    plain: "fetch('/api/checkout/session'",
    replacedNeedle: "fetchWithParentPinRetry",
    replaced: "fetchWithParentPinRetry(promptPin, '/api/checkout/session'",
  },
];

const uiFiles = [
  "src/components/SubscribeButton.tsx",
  "src/components/cart/StickyCheckoutBar.tsx",
  "src/components/checkout/CheckoutDebugButton.tsx",
  "src/components/pricing/ServerTruthBlock.tsx",
];

const uiResults = uiFiles.map(f => patchClientFile(f, patterns));

console.log("== Guard results ==");
console.table(guardResults);

console.log("== UI results ==");
console.table(uiResults);

console.log("✅ Done.");
