"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
type Ctx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  resolved: "light" | "dark";
  toggle: () => void;
};

const C = createContext<Ctx | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  // Récupérer la préférence stockée
  useEffect(() => {
    try {
      const m = localStorage.getItem("mode");
      if (m === "light" || m === "dark" || m === "system") setMode(m);
    } catch {}
  }, []);

  // Persister la préférence
  useEffect(() => {
    try {
      localStorage.setItem("mode", mode);
    } catch {}
  }, [mode]);

  // Calculer le thème effectif et appliquer la classe .dark sur <html>
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const r = mode === "system" ? (mq.matches ? "dark" : "light") : mode;
      setResolved(r);
      document.documentElement.classList.toggle("dark", r === "dark");
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, [mode]);

  const toggle = () => setMode((p) => (p === "dark" ? "light" : "dark"));

  return (
    <C.Provider value={{ mode, setMode, resolved, toggle }}>{children}</C.Provider>
  );
}

export const useMode = () => {
  const v = useContext(C);
  if (!v) throw new Error("useMode must be used within ModeProvider");
  return v;
};
