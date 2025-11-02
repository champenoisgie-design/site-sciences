"use client";
import { useEffect, useMemo, useState } from "react";

type Variant = { id: string; label: string; video: string; poster?: string };
type Manifest = { name: string; slug: string; variants: Variant[]; gallery?: string[] };

export default function ThemeShowcase({ manifest }: { manifest: Manifest }) {
  const [current, setCurrent] = useState<Variant>(() => manifest.variants[0]);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );
  useEffect(() => {}, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold mb-2">{manifest.name} — thèmes visuels</h1>
      <p className="opacity-75 mb-6">
        Aperçu en conditions réelles. Si “Réduire les animations” est activé, la vidéo est remplacée par une image statique.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl overflow-hidden border bg-black/5">
          <div className="aspect-video bg-black/70 flex items-center justify-center">
            {reduced ? (
              <img src={current.poster || ""} alt={current.label} className="w-full h-full object-cover" />
            ) : (
              <video
                key={current.id}
                className="w-full h-full object-cover"
                src={current.video}
                poster={current.poster}
                muted
                autoPlay
                loop
                playsInline
              />
            )}
          </div>
        </div>

        <div className="space-y-3">
          {manifest.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setCurrent(v)}
              className={`w-full text-left border rounded-lg px-3 py-2 hover:bg-neutral-50 ${
                v.id === current.id ? "ring-2 ring-black/10" : ""
              }`}
            >
              <div className="text-sm font-medium">{v.label}</div>
              <div className="text-xs opacity-60 truncate">{v.video.replace(/^.*\//, "/")}</div>
            </button>
          ))}
          <a href="/panier" className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm">
            Choisir ce thème
          </a>
        </div>
      </div>
    </div>
  );
}
