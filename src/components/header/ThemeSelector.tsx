"use client";
import React, { useState } from "react";
import { themeIsOwned } from "@/lib/entitlements/client";

const THEMES = [
  { slug: "mario",    title: "Mario" },
  { slug: "onepiece", title: "One Piece" }
];

export default function ThemeSelector({ alignLeft = true }: { alignLeft?: boolean }) {
  const [open, setOpen] = useState(false);
  const go = (slug: string) => {
    if (themeIsOwned(slug)) window.location.href = `/themes/${slug}`;
    else window.location.href = `/panier?theme=${slug}`;
  };
  return (
    <div className={`relative ${alignLeft ? "" : "ml-auto"}`}>
      <button onClick={() => setOpen(v => !v)}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 bg-white hover:bg-slate-50"
              aria-haspopup="listbox" aria-expanded={open}>
        🎨 Thème
        <svg width="16" height="16" viewBox="0 0 20 20"><path d="M5 7l5 6 5-6" fill="currentColor"/></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 min-w-[180px] rounded-xl border bg-white shadow">
          {THEMES.map(t => (
            <button key={t.slug} onClick={() => go(t.slug)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50">
              <span>{t.title}</span>
              <span className={`text-[11px] ${themeIsOwned(t.slug) ? "text-emerald-700" : "text-slate-400"}`}>
                {themeIsOwned(t.slug) ? "✅ Possédé" : "Acheter"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
