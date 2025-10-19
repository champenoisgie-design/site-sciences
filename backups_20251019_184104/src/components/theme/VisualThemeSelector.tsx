"use client";
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
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm">Thème visuel</label>
      <select
        value={slug ?? ""}
        onChange={(e) => setTheme(e.target.value || null)}
        className="border rounded px-2 py-1"
      >
        {THEMES.map(t => (
          <option key={t.slug || "base"} value={t.slug}>{t.name}</option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={reducedMotion} onChange={e => setReducedMotion(e.target.checked)} />
        Réduire les animations
      </label>
    </div>
  );
}
