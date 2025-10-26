"use client";
import { usePathname } from "next/navigation";
import VisualThemeSelector from "@/components/theme/VisualThemeSelector";

/**
 * Bridge pour afficher les contrôles de thème UNIQUEMENT en preview.
 * Évite le doublon avec le header global sur les pages normales.
 */
export default function HeaderThemeBridge() {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview");
  if (!isPreview) return null;

  return (
    <div className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-6 text-sm">
        <div className="font-medium">Thème visuel</div>
        <VisualThemeSelector />
      </div>
    </div>
  );
}
