"use client";

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
