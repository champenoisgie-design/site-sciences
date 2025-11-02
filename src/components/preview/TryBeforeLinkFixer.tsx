"use client";
import { useEffect } from "react";

export default function TryBeforeLinkFixer() {
  useEffect(() => {
    try {
      const scopes = document.querySelectorAll<HTMLElement>('[data-theme-card], .theme-card, .card, main, body');
      (scopes.length ? scopes : [document.body]).forEach((root) => {
        const viewLinks = root.querySelectorAll<HTMLAnchorElement>('a[href^="/themes/"]');
        viewLinks.forEach((vl) => {
          const m = vl.getAttribute("href")?.match(/^\/themes\/([^/?#]+)/);
          const slug = m?.[1];
          if (!slug) return;
          const tryLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>('a'))
            .filter(a => /Essayer avant d.?acheter/i.test(a.textContent || ""));
          tryLinks.forEach((a) => {
            a.setAttribute("href", `/preview/accueil?demo=${slug}`);
            a.addEventListener("click", (ev) => {
              ev.preventDefault();
              window.location.href = `/preview/accueil?demo=${slug}`;
            }, { once: true });
          });
        });
      });
    } catch {}
  }, []);
  return null;
}
