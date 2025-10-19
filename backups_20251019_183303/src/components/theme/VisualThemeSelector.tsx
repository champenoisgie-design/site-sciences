"use client";
import React, { useState } from "react";
import { useVisualTheme } from "@/contexts/visualTheme";

export default function VisualThemeSelector({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, hasEntitlement } = useVisualTheme();
  const [msg, setMsg] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as "base" | "onepiece1";
    if (value === "onepiece1" && !hasEntitlement("onepiece1")) {
      setMsg("Thème premium non activé sur ce compte. Voir Tarifs.");
      e.target.value = "base";
      setTheme("base");
      return;
    }
    setMsg(null);
    setTheme(value);
  }

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "px-2 py-1"}`}>
      <label className="text-sm opacity-80">Thème visuel</label>
      <select
        value={theme}
        onChange={onChange}
        className="rounded-lg border px-2 py-1 text-sm bg-white/70 backdrop-blur-sm"
        aria-label="Choix du thème visuel"
      >
        <option value="base">Basique (défaut)</option>
        <option value="onepiece1">
          OnePiece1 {hasEntitlement("onepiece1") ? "✓" : "— Premium"}
        </option>
      </select>
      {msg && (
        <a href="/tarifs" className="text-xs underline decoration-dashed underline-offset-2 opacity-90 hover:opacity-100">
          {msg}
        </a>
      )}
    </div>
  );
}
