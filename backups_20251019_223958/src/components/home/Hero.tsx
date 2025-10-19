"use client";
import { useVisualTheme } from "@/contexts/visualTheme";

export default function Hero() {
  const { manifest, reducedMotion } = useVisualTheme();

  return (
    <section className="relative h-[50vh] flex items-center justify-center themed-hero">
      {manifest && !reducedMotion ? (
        <video
          className="absolute inset-0 w-full h-full object-cover bg-video"
          src={manifest.assets.video}
          poster={manifest.assets.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        manifest && <img className="absolute inset-0 w-full h-full object-cover bg-poster" src={manifest.assets.poster} alt="" />
      )}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold">Apprendre plus vite, progresser sereinement</h1>
        <p className="mt-3 opacity-90">Cours & exercices personnalisés. Dès 9,99 €/mois.</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  );
}
