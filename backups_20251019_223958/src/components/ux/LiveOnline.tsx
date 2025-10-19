"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * LiveOnline : compteur "joueurs en ligne" placeholder.
 * - Démarre avec une valeur plausible.
 * - Ajoute/retire un petit delta périodiquement pour simuler une activité.
 */
export default function LiveOnline(props: { base?: number; label?: string; className?: string }) {
  const { base = 1240, label = "joueurs en ligne", className } = props;
  const [n, setN] = useState(() => base + Math.floor(Math.random() * 80));

  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const delta = Math.floor((Math.random() - 0.4) * 14); // -5..+8 environ
        const next = Math.max(1, prev + delta);
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const formatted = useMemo(() => new Intl.NumberFormat().format(n), [n]);

  return (
    <div className={["inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm", className].filter(Boolean).join(" ")}>
      <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
      <span suppressHydrationWarning className="tabular-nums font-semibold">{typeof window === "undefined" ? "—" : formatted}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
