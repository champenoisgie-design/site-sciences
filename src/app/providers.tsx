"use client";
import React from "react";
// On importe *tout* et on prend soit le nommé .ModeProvider, soit le .default
import * as MP from "@/components/ModeProvider";

const ModeProviderComp =
  // si export nommé
  (MP as any).ModeProvider ??
  // si export default
  (MP as any).default ??
  // fallback no-op (au cas où le fichier n'existe pas)
  (({ children }: any) => <>{children}</>);

export function Providers({ children }: { children: React.ReactNode }) {
  return <ModeProviderComp>{children}</ModeProviderComp>;
}
