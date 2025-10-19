"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type VisualThemeKey = "base" | "onepiece1";

type VisualThemeContextValue = {
  theme: VisualThemeKey;
  setTheme: (t: VisualThemeKey) => void;
  hasEntitlement: (t: VisualThemeKey) => boolean;
};

const Ctx = createContext<VisualThemeContextValue | null>(null);

async function fetchEntitlements(): Promise<Record<string, boolean>> {
  try {
    const r = await fetch("/api/entitlements/sync", { credentials: "include" });
    if (r.ok) {
      const data = await r.json().catch(() => ({}));
      const localFlag = typeof window !== "undefined" && window.localStorage.getItem("entitlement:theme:onepiece1") === "1";
      return { onepiece1: Boolean((data?.themes && data.themes.onepiece1) ?? localFlag) };
    }
  } catch {}
  const localFlag = typeof window !== "undefined" && window.localStorage.getItem("entitlement:theme:onepiece1") === "1";
  return { onepiece1: localFlag };
}

export function VisualThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<VisualThemeKey>("base");
  const [rights, setRights] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = window.localStorage.getItem("visual-theme") as VisualThemeKey | null;
    if (saved === "base" || saved === "onepiece1") setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("visual-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchEntitlements().then(setRights);
  }, []);

  const hasEntitlement = (t: VisualThemeKey) => (t === "base" ? true : !!rights[t]);

  const value = useMemo(() => ({ theme, setTheme, hasEntitlement }), [theme, rights]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVisualTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVisualTheme must be used within VisualThemeProvider");
  return v;
}
