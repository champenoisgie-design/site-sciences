"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useVisualTheme } from "@/contexts/visualTheme";

const THEMES = [
  { slug: "", name: "Basique" },
  { slug: "onepiece", name: "One Piece" },
  { slug: "mario", name: "Mario" },
  { slug: "dbz", name: "Dragon Ball Z" },
  { slug: "zelda", name: "Zelda" },
];

export default function VisualThemeSelector() {
  const { slug, setTheme, reducedMotion, setReducedMotion } = useVisualTheme();
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Empêche le doublon : un seul sélecteur par page
    const attr = "data-theme-selector-mounted";
    if (document.body.hasAttribute(attr)) setAllowed(false);
    else {
      document.body.setAttribute(attr, "1");
      setAllowed(true);
    }
    return () => {
      if (document.body.getAttribute(attr) === "1") {
        document.body.removeAttribute(attr);
      }
    };
  }, []);

  if (!allowed) return null;

  const onChangeTheme = (value: string) => {
    setTheme(value || null);
    // Navigation vers la page démo du thème (sauf basique -> home)
    if (!value) {
      if (pathname !== "/") router.push("/");
    } else {
      router.push(`/themes/${value}`);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm">Thème visuel</label>
      <select
        value={slug ?? ""}
        onChange={(e) => onChangeTheme(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {THEMES.map((t) => (
          <option key={t.slug || "base"} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
        />
        Réduire les animations
      </label>
    </div>
  );
}
