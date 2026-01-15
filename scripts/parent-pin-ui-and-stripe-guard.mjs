import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(abs(p)), { recursive: true }); fs.writeFileSync(abs(p), s, "utf8"); };

function ensureFile(p) {
  if (!exists(p)) throw new Error(`Missing ${p}`);
}

ensureFile("src/app/api/parent-pin/status/route.ts");
ensureFile("src/app/api/parent-pin/verify/route.ts");
ensureFile("src/lib/parentPinGuard.ts");

// 1) UI files
write("src/components/parent-pin/ParentPinModal.tsx", `"use client";

import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onVerified: (unlockedUntil?: string) => void;
};

export function ParentPinModal({ open, onClose, onVerified }: Props) {
  const [pin, setPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setPin("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  async function submit() {
    setError(null);
    const clean = pin.replace(/\\D/g, "").slice(0, 4);
    if (clean.length !== 4) {
      setError("PIN invalide (4 chiffres).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/parent-pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: clean }),
      });
      const text = await res.text();
      if (!res.ok) {
        try {
          const j = JSON.parse(text);
          setError(j?.error ?? "Erreur PIN");
        } catch {
          setError("Erreur PIN");
        }
        return;
      }
      const j = JSON.parse(text);
      onVerified(j?.unlockedUntil);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-2 text-lg font-semibold">Espace Parents — PIN</div>
        <div className="mb-4 text-sm text-gray-600">
          Saisis le PIN à 4 chiffres pour accéder à cette section.
        </div>

        <input
          inputMode="numeric"
          pattern="\\d{4}"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-lg tracking-widest"
          placeholder="••••"
          autoFocus
        />

        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border px-4 py-3"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={submit}
            className="flex-1 rounded-xl bg-black px-4 py-3 text-white"
            disabled={loading}
          >
            {loading ? "..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
}
`);

write("src/components/parent-pin/useParentPin.ts", `"use client";

import * as React from "react";

type Status = {
  unlocked: boolean;
  unlockedUntil: string | null;
};

export function useParentPinStatus() {
  const [status, setStatus] = React.useState<Status>({ unlocked: false, unlockedUntil: null });
  const [loading, setLoading] = React.useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/parent-pin/status", { cache: "no-store" as any });
      const j = await res.json().catch(() => null);
      setStatus({
        unlocked: !!j?.unlocked,
        unlockedUntil: j?.unlockedUntil ?? null,
      });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { refresh(); }, []);

  return { status, loading, refresh };
}
`);

write("src/components/parent-pin/ParentPinGate.tsx", `"use client";

import * as React from "react";
import { ParentPinModal } from "./ParentPinModal";
import { useParentPinStatus } from "./useParentPin";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function ParentPinGate({ children, title = "Section protégée", description }: Props) {
  const { status, loading, refresh } = useParentPinStatus();
  const [open, setOpen] = React.useState(false);

  if (loading) {
    return <div className="rounded-2xl border p-4 text-sm text-gray-600">Chargement…</div>;
  }

  if (status.unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-gray-600">
        {description ?? "Cette section nécessite le PIN Parents."}
      </div>
      <button
        className="mt-3 rounded-xl bg-black px-4 py-2 text-white"
        onClick={() => setOpen(true)}
      >
        Déverrouiller
      </button>

      <ParentPinModal
        open={open}
        onClose={() => setOpen(false)}
        onVerified={() => refresh()}
      />
    </div>
  );
}
`);

// 2) Guard Stripe checkout (serveur)
const checkoutFile = "src/app/api/stripe/checkout/route.ts";
if (exists(checkoutFile)) {
  let src = read(checkoutFile);

  if (!src.includes('requireParentPinUnlocked')) {
    // add import
    if (!src.includes('from "@/lib/parentPinGuard"')) {
      src = src.replace(
        /import\s+\{\s*NextResponse\s*\}\s+from\s+["']next\/server["'];?/,
        (m) => `${m}\nimport { requireParentPinUnlocked } from "@/lib/parentPinGuard";`
      );
    }

    // insert call near start of POST
    src = src.replace(
      /export\s+async\s+function\s+POST\s*\([^\)]*\)\s*\{\s*\n/,
      (m) => `${m}  // Parents PIN required to start checkout\n  await requireParentPinUnlocked();\n\n`
    );
  }

  write(checkoutFile, src);
  console.log("✅ Patched Stripe checkout route with requireParentPinUnlocked()");
} else {
  console.log("⚠️ Stripe checkout route not found, skipped:", checkoutFile);
}

console.log("✅ Parent PIN UI components created.");
