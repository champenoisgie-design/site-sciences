"use client";
import { useEffect } from "react";

export default function TryBeforeLinkFixer() {
  useEffect(() => {
    try {
      const root = document;
      const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-theme-card], .theme-card, .card'));
      const scopes = cards.length ? cards : [document.body];
      scopes.forEach((scope) => {
        const themeLink = scope.querySelector<HTMLAnchorElement>('a[href^="/themes/"]');
        const slug = themeLink?.getAttribute("href")?.match(/^\/themes\/([^/?#]+)/)?.[1];
        if (!slug) return;
        const tryBtns = Array.from(scope.querySelectorAll<HTMLAnchorElement>('a,button'))
          .filter(a => /Essayer avant d.?acheter/i.test(a.textContent || ""));
        tryBtns.forEach((el) => {
          const isA = el.tagName.toLowerCase() === "a";
          if (isA) el.setAttribute("href", `/preview/accueil?demo=${slug}`);
          el.addEventListener("click", (ev) => {
            ev.preventDefault();
            window.location.href = `/preview/accueil?demo=${slug}`;
          }, { once: true });
        });
      });
    } catch {}
  }, []);
  return null;
}
