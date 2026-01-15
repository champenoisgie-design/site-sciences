"use client";

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
    const clean = pin.replace(/\D/g, "").slice(0, 4);
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
          pattern="\d{4}"
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
