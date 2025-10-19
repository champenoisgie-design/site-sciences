"use client";
import React, { useEffect } from "react";
import "./preview.css";

function closestSection(el: Element | null): HTMLElement | null {
  let cur = el as HTMLElement | null;
  for (let i = 0; i < 7 && cur; i++) {
    if (cur.matches?.("section,main,form,article,div")) return cur;
    cur = cur.parentElement;
  }
  return null;
}

export default function PreviewWrapperClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Masque le header global dans la PREVIEW
    document.body.classList.add("preview-hide-global-header");

    // H1 (colonne gauche)
    const h1 = Array.from(document.querySelectorAll("h1")).find((n) =>
      (n.textContent || "").toLowerCase().includes("apprendre plus vite"),
    ) as HTMLElement | undefined;

    // Champ e-mail
    const email = (document.querySelector('input[type="email"], input[placeholder*="mail" i]') ??
      null) as HTMLInputElement | null;

    // Scope du hero (colonne gauche)
    const leftScope = closestSection(h1 || email);
    leftScope?.classList.add("preview-hero-scope");

    // Intro sous le H1 + phrase d’accroche du H1
    const introPhrases = Array.from(document.querySelectorAll("p,div")).filter((el) => {
      const t = (el.textContent || "").toLowerCase();
      return (
        t.includes("exercices guidés, tutoriels clairs") || // sous-texte du H1
        t.includes("les modes complémentaires")            // suite de l'intro
      );
    });
    introPhrases.forEach((el) => el.classList.add("hero-intro"));

    // Boutons / liens du hero (gauche)
    email?.classList.add("hero-email");
    const login = Array.from(document.querySelectorAll("a")).find((a) =>
      (a.textContent || "").toLowerCase().includes("me connecter"),
    );
    login?.classList.add("hero-link");

    const chooseBtn = Array.from(document.querySelectorAll("a,button")).find((el) =>
      (el.textContent || "").toLowerCase().includes("choisir mon niveau"),
    );
    chooseBtn?.classList.add("hero-cta-secondary");

    const startBtn = Array.from(document.querySelectorAll("a,button")).find((el) =>
      (el.textContent || "").toLowerCase().includes("commencer l’essai") ||
      (el.textContent || "").toLowerCase().includes("commencer l'essai"),
    );
    startBtn?.classList.add("hero-cta-primary");

    // Colonne droite (liste à puces)
    const bullets = Array.from(document.querySelectorAll("ul,ol")).find((ul) => {
      const t = (ul.textContent || "").toLowerCase();
      return (
        t.includes("exercices interactifs") ||
        t.includes("progression par chapitre") ||
        t.includes("multi-joueur") ||
        t.includes("tdah") ||
        t.includes("mode famille")
      );
    });
    if (bullets) {
      bullets.classList.add("hero-bullets");
      bullets.parentElement?.classList.add("hero-bullets");
      closestSection(bullets)?.classList.add("preview-hero-scope");
    }

    // Bandeau “Le contenu s’adapte…”
    const adaptBanner = Array.from(document.querySelectorAll("div,section")).find((el) => {
      const t = (el.textContent || "").toLowerCase();
      return t.includes("le contenu s’adapte") || t.includes("le contenu s adapte");
    });
    adaptBanner?.classList.add("preview-top-banner", "hero-intro");

    return () => {
      document.body.classList.remove("preview-hide-global-header");
    };
  }, []);

  return <main className="relative min-h-screen">{children}</main>;
}
