// src/hooks/useServerPrice.ts
"use client";
import { useEffect, useMemo, useState } from "react";

type SubscriptionLine = {
  basePrice: number;
  subjectsCount: number;
  meta?: Record<string, string | number | boolean | null | undefined>;
};
export type CartInput = {
  currency?: string;
  primary: SubscriptionLine;
  familySecond?: SubscriptionLine | null;
  hasReferral?: boolean;
  isFirst100?: boolean;
};

export function useServerPrice(input: CartInput | null) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const body = useMemo(() => (input ? JSON.stringify(input) : null), [input]);

  useEffect(() => {
    if (!body) return;
    const ctrl = new AbortController();
    async function run() {
      setLoading(true); setError(null);
      try {
        const res = await fetch("/api/cart/price", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          signal: ctrl.signal,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "server_error");
        setData(json);
      } catch (e:any) {
        if (e.name !== "AbortError") setError(e.message || "error");
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => ctrl.abort();
  }, [body]);

  return { data, error, loading };
}
