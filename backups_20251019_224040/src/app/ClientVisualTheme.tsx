"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import HeaderThemeBridge from "@/components/theme/HeaderThemeBridge";

/**
 * ClientVisualTheme: n'affiche le bridge (contrôles) qu'en /preview/**.
 * Ailleurs, on ne rend que {children}.
 */
export default function ClientVisualTheme({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview");
  return (
    <>
      {isPreview && <HeaderThemeBridge />}
      {children}
    </>
  );
}
