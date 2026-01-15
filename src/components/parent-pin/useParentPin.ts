"use client";

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
