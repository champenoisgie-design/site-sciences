"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function HeroVideo() {
  const sp = useSearchParams();
  const demo = sp?.get("demo") || "";
  const src = demo ? `/themes/${demo}/hero.mp4` : `/intro.mp4`;

  return (
    <div className="relative w-full min-h-[70vh] overflow-hidden rounded-2xl">
      <video key={src} autoPlay muted playsInline loop preload="metadata"
             className="absolute inset-0 h-full w-full object-cover"
             poster="/poster.jpg">
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div className="relative z-10 p-6 md:p-10 text-white">
        <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">Apprends en t’amusant</h1>
        <p className="mt-2 max-w-xl text-white/90">
          Découvre un aperçu gratuit avant d’acheter. Combine Annuel (−20%) + Pack Famille (−20%) pour le Méga pack (−30%).
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/panier" className="rounded-xl bg-white/90 text-black px-4 py-2 font-semibold hover:bg-white">Aller au panier</a>
          <a href="/tarifs" className="rounded-xl bg-black/60 px-4 py-2 font-semibold hover:bg-black/70">Voir les tarifs</a>
        </div>
      </div>
    </div>
  );
}
