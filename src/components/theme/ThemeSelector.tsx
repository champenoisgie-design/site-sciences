"use client";

import React, { useEffect, useMemo, useState } from "react";

export type ThemeKey = "mario" | "onepiece";
export type SkinKey = "neon" | "solaire" | "pastel";

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

type Props = {
  variant?: "compact" | "inline";
  className?: string;
  /** si tu veux pouvoir désactiver le choix (ex: selon mode) */
  disabled?: boolean;
};

const THEME_LABEL: Record<ThemeKey, string> = {
  mario: "Mario",
  onepiece: "One Piece",
};

const SKIN_LABEL: Record<SkinKey, string> = {
  neon: "Neon",
  solaire: "Solaire",
  pastel: "Pastel",
};

const STORAGE_THEME = "ss_theme_pack";
const STORAGE_SKIN = "ss_ui_skin";

export default function ThemeSelector({ variant = "compact", className, disabled }: Props) {
  const [theme, setTheme] = useState<ThemeKey>("mario");
  const [skin, setSkin] = useState<SkinKey>("neon");

  useEffect(() => {
    const t = (localStorage.getItem(STORAGE_THEME) as ThemeKey | null) || "mario";
    const s = (localStorage.getItem(STORAGE_SKIN) as SkinKey | null) || "neon";
    if (t === "mario" || t === "onepiece") setTheme(t);
    if (s === "neon" || s === "solaire" || s === "pastel") setSkin(s);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SKIN, skin);
  }, [skin]);

  const pills = useMemo(() => {
    const base = "rounded-full px-3 py-1 text-xs font-semibold transition";
    const on = "bg-slate-900 text-white border border-slate-700";
    const off = "bg-white/5 text-slate-200 border border-slate-800 hover:border-slate-600";
    return { base, on, off };
  }, []);

  return (
    <div
      className={cn(
        variant === "compact"
          ? "rounded-2xl border border-slate-800 bg-slate-950/30 p-3"
          : "rounded-xl border border-slate-800 bg-slate-950/20 p-2",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-slate-400">Thème</div>
        <div className="text-[10px] text-slate-500">sauvegardé</div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {(["mario", "onepiece"] as ThemeKey[]).map((t) => (
          <button
            key={t}
            disabled={disabled}
            onClick={() => setTheme(t)}
            className={cn(pills.base, theme === t ? pills.on : pills.off, disabled && "opacity-60")}
          >
            {THEME_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-xs text-slate-400">Skin</div>
        <div className="text-[10px] text-slate-500">UI</div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {(["neon", "solaire", "pastel"] as SkinKey[]).map((s) => (
          <button
            key={s}
            disabled={disabled}
            onClick={() => setSkin(s)}
            className={cn(pills.base, skin === s ? pills.on : pills.off, disabled && "opacity-60")}
          >
            {SKIN_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300">
        Actif : <span className="font-semibold text-white">{THEME_LABEL[theme]}</span> •{" "}
        <span className="font-semibold text-white">{SKIN_LABEL[skin]}</span>
      </div>
    </div>
  );
}
