"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Un seul sélecteur visible par page : le premier monté gagne.
    const attr = "data-theme-selector-mounted";
    if (typeof document !== "undefined") {
      if (document.body.hasAttribute(attr)) {
        setAllowed(false);
      } else {
        document.body.setAttribute(attr, "1");
        setAllowed(true);
      }
      return () => {
        // Au démontage, libère le slot pour que la prochaine page puisse l'afficher.
        if (document.body.getAttribute(attr) === "1") {
          document.body.removeAttribute(attr);
        }
      };
    }
  }, []);

  if (!allowed) return null;

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm">Thème visuel</label>
      <select
        value={slug ?? ""}
        onChange={(e) => setTheme(e.target.value || null)}
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
