"use client";
import React, { useEffect } from "react";
import { useVisualTheme } from "@/contexts/visualTheme";

/** Injecte la vidéo et un flag body quand le thème OnePiece1 est actif & autorisé */
export default function VisualThemeBackground() {
  const { theme, hasEntitlement } = useVisualTheme();
  const active = theme === "onepiece1" && hasEntitlement("onepiece1");

  // Flag sur le body pour activer les styles du hero, uniquement quand OnePiece1 est actif
  useEffect(() => {
    if (active) document.body.classList.add("onepiece1-active");
    return () => document.body.classList.remove("onepiece1-active");
  }, [active]);

  if (!active) return null;

  return (
    <>
      <video autoPlay muted loop playsInline className="fixed inset-0 h-full w-full object-cover -z-10">
        <source src="/onepiece3.mp4" type="video/mp4" />
      </video>

      {/* Voiles pour lisibilité */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-black/65 via-black/45 to-transparent" />
      </div>
    </>
  );
}
