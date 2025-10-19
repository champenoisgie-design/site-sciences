"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeManifest = {
  name: string; slug: string;
  palette: { primary: string; accent: string; bg: string };
  assets: { video: string; poster: string; badge: string; icon: string };
};

type VisualThemeContextType = {
  slug: string | null;
  manifest: ThemeManifest | null;
  setTheme: (slug: string | null) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
};

const Ctx = createContext<VisualThemeContextType | null>(null);

export function VisualThemeProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [manifest, setManifest] = useState<ThemeManifest | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("visualTheme.slug");
    if (saved) setSlug(saved);
    const rm = localStorage.getItem("visualTheme.reducedMotion") === "1";
    setReducedMotion(rm);
  }, []);

  useEffect(() => {
    if (!slug) {
      setManifest(null);
      document.body.classList.forEach(c => { if (c.endsWith("-active")) document.body.classList.remove(c); });
      return;
    }
    fetch(`/themes/${slug}/manifest.json`)
      .then(r => r.json())
      .then((m: ThemeManifest) => {
        setManifest(m);
        document.body.classList.forEach(c => { if (c.endsWith("-active")) document.body.classList.remove(c); });
        document.body.classList.add(`${slug}-active`);
      })
      .catch(() => setManifest(null));
    localStorage.setItem("visualTheme.slug", slug);
  }, [slug]);

  useEffect(() => {
    localStorage.setItem("visualTheme.reducedMotion", reducedMotion ? "1" : "0");
  }, [reducedMotion]);

  return (
    <Ctx.Provider value={{ slug, manifest, setTheme: setSlug, reducedMotion, setReducedMotion }}>
      {children}
    </Ctx.Provider>
  );
}

export function useVisualTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useVisualTheme must be used within VisualThemeProvider");
  return v;
}
