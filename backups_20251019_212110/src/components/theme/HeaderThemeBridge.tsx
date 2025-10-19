"use client";
import React, { useEffect, useRef } from "react";
import VisualThemeSelector from "@/components/theme/VisualThemeSelector";

export default function HeaderThemeBridge() {
  const mountRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const header =
      (document.querySelector("header") as HTMLElement | null) ||
      (document.querySelector('[role="banner"]') as HTMLElement | null);
    if (!header) return;

    // S'il y a DÉJÀ un sélecteur visuel (autre que le nôtre), on le supprime pour éviter le doublon
    header
      .querySelectorAll<HTMLElement>('[data-visual-theme="selector"]')
      .forEach((n) => {
        // on gardera UNIQUEMENT l'instance que l'on monte ci-dessous
        n.remove();
      });

    // Trouve l'ancien contrôle "Thème : ..." sans toucher au mode d'apprentissage
    const allControls = Array.from(
      header.querySelectorAll<HTMLElement>("select,button,[role='combobox']")
    );

    const themeControl =
      allControls.find((el) => {
        const aria = (el.getAttribute("aria-label") || "").toLowerCase();
        const txt = (el.textContent || "").toLowerCase();
        // On cherche explicitement le mot-clé "thème" pour éviter le mode d'apprentissage
        if (aria.includes("thème")) return true;
        // Regarde le label voisin
        const wrap = el.closest("label,span,div") as HTMLElement | null;
        const labelTxt = (wrap?.textContent || "").toLowerCase();
        return labelTxt.includes("thème");
      }) || null;

    // Petit wrapper autour du contrôle cible
    const tinyWrapper =
      themeControl?.closest<HTMLElement>("label,span,div,li") || themeControl;

    // Rangée qui contient les filtres (on insère notre sélecteur ici)
    const row = tinyWrapper?.parentElement || header;

    // Ne masque QUE le petit wrapper du vieux sélecteur
    if (tinyWrapper) {
      tinyWrapper.style.display = "none";
      tinyWrapper.setAttribute("data-replaced-theme", "control");
    }

    // Monte notre sélecteur à la suite du vieux, sans toucher aux autres (dont mode d'apprentissage)
    if (row) {
      const holder = document.createElement("span");
      holder.dataset.visualTheme = "selector";
      holder.className = "inline-flex items-center ml-2";
      if (tinyWrapper?.nextSibling) {
        row.insertBefore(holder, tinyWrapper.nextSibling);
      } else {
        row.appendChild(holder);
      }
      if (mountRef.current) holder.appendChild(mountRef.current);
    }
  }, []);

  return (
    <span
      ref={mountRef}
      data-visual-theme="selector"
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      <VisualThemeSelector compact />
    </span>
  );
}
