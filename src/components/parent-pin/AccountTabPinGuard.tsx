"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useParentPinModal } from "@/components/parent-pin/useParentPinModal";

/**
 * Guard PIN pour /compte (tabs Parents + Abonnement)
 * - Ouvre le PIN sur clic (Parents/Abonnement)
 * - Ouvre aussi si l'utilisateur arrive directement avec ?tab=parents|abonnement
 * - Anti-boucle : une seule demande à la fois + ignore le prochain effet après push
 */
export function AccountTabPinGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = (params.get("tab") || "").toLowerCase();

  const { open, ParentPinModal } = useParentPinModal();

  const pendingRef = React.useRef(false);
  const skipNextUrlRef = React.useRef<string | null>(null);
  const lastOpenedForRef = React.useRef<string | null>(null);

  const isProtectedTab = (t: string) => t === "parents" || t === "abonnement";

  const currentUrl = React.useMemo(() => {
    const q = params.toString();
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, params]);

  async function runPinThen(fn: () => void | Promise<void>, markUrl: string) {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      await open();     // affiche modal, résout quand PIN ok
      await fn();       // navigation / action
      // on marque l'URL attendue pour ignorer le prochain effet tab
      skipNextUrlRef.current = markUrl;
    } finally {
      // cooldown micro (évite double trigger dans le même tick React)
      setTimeout(() => {
        pendingRef.current = false;
      }, 50);
    }
  }

  // 1) Si arrivée directe sur /compte?tab=parents|abonnement
  React.useEffect(() => {
    if (!isProtectedTab(tab)) return;

    // si on vient d'un push, ignore une fois
    if (skipNextUrlRef.current && skipNextUrlRef.current === currentUrl) {
      skipNextUrlRef.current = null;
      return;
    }

    // évite d'ouvrir 10 fois si le tab ne change pas
    const key = `direct:${currentUrl}`;
    if (lastOpenedForRef.current === key) return;
    lastOpenedForRef.current = key;

    void runPinThen(() => {
      // pas besoin de push, on est déjà sur la bonne URL
    }, currentUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, currentUrl]);

  // 2) Intercepte clics sur "Parents" / "Abonnement" dans l'UI
  React.useEffect(() => {
    function isClickOnProtected(el: HTMLElement) {
      const text = (el.textContent || "").trim().toLowerCase();
      const href = (el as HTMLAnchorElement).getAttribute?.("href") || "";

      const hitParents = text.includes("parents") || /tab=parents/i.test(href);
      const hitAbon = text.includes("abonnement") || /tab=abonnement/i.test(href);

      if (!hitParents && !hitAbon) return null;

      // Destination
      if (href && href.startsWith("/")) return href;
      return hitParents ? "/compte?tab=parents" : "/compte?tab=abonnement";
    }

    async function handler(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const el = target.closest("a,button") as HTMLElement | null;
      if (!el) return;

      const dest = isClickOnProtected(el);
      if (!dest) return;

      // stop action immédiate
      e.preventDefault();
      e.stopPropagation();

      // si on clique déjà l'onglet courant, on veut quand même le PIN "à chaque fois"
      const markUrl = dest;

      void runPinThen(() => {
        router.push(dest);
      }, markUrl);
    }

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, open]);

  return <>{ParentPinModal}</>;
}
