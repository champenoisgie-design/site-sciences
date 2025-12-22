"use client";

import { useEffect, useState } from "react";

const STORAGE = "cmc.theme";

function getThemeClient(): string {
  try {
    return localStorage.getItem(STORAGE) || document.documentElement.getAttribute("data-theme") || "light";
  } catch {
    return document.documentElement.getAttribute("data-theme") || "light";
  }
}

function setThemeClient(next: string) {
  try {
    localStorage.setItem(STORAGE, next);
  } catch {}
  document.documentElement.setAttribute("data-theme", next);
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    setTheme(getThemeClient());
  }, []);

  const isLight = theme === "light";
  const label = mounted ? (isLight ? "clair" : "sombre") : "…";

  return (
    <button
      className="pill"
      onClick={() => {
        const current = getThemeClient();
        const next = current === "light" ? "dark" : "light";
        setThemeClient(next);
        setTheme(next);
      }}
      aria-label="Basculer le thème"
      suppressHydrationWarning
    >
      {label}
    </button>
  );
}
