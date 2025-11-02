"use client";
export function themeIsOwned(slug: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    const v = localStorage.getItem(`theme:owned:${slug}`);
    return v === "1" || v === "true";
  } catch { return false; }
}
export function markThemeOwned(slug: string) {
  if (typeof window !== "undefined") localStorage.setItem(`theme:owned:${slug}`, "1");
}
