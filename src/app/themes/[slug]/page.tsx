import React from "react";
import ThemeGate from "@/components/theme/ThemeGate";
import fs from "node:fs/promises";
import path from "node:path";


// ThemeGate est un composant client (protège l'accès si le thème n'est pas possédé)


type Chapter = { id: string; title: string; duration?: string };
type Manifest = {
  slug: string;
  title: string;
  color?: string;
  summary?: string;
  chapters?: Chapter[];
};

async function readManifest(slug: string): Promise<Manifest | null> {
  const p = path.join(process.cwd(), "public", "themes", slug, "manifest.json");
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return null;
  }
}

export default async function ThemePage({ params }: { params: { slug: string } }) {
  const manifest = await readManifest(params.slug);
  if (!manifest) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Thème introuvable</h1>
        <p className="text-muted-foreground">Aucun manifest pour “{params.slug}”.</p>
      </div>
    );
  }

  const color = manifest.color ?? "#334155";

  return (
    <ThemeGate slug={manifest.slug}>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border p-5 bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold" style={{ color }}>
              {manifest.title}
            </h1>
            <a
              href="/panier"
              className="rounded-xl px-4 py-2 bg-black text-white hover:opacity-90 font-semibold"
            >
              Ajouter au panier
            </a>
          </div>

          {manifest.summary ? (
            <p className="mt-2 text-sm text-muted-foreground">{manifest.summary}</p>
          ) : null}

          <h2 className="mt-6 text-lg font-bold">Chapitres</h2>
          <div className="mt-2 grid gap-2">
            {(manifest.chapters ?? []).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border px-3 py-2"
              >
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-muted-foreground">
                  {c.duration ?? "—"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-[12px] text-muted-foreground">
            Astuce: choisis l’<strong>Annuel (−20%)</strong> et combine avec le{" "}
            <strong>Pack Famille (−20%)</strong> pour débloquer le{" "}
            <strong>Méga pack −30%</strong>.
          </div>
        </div>
      </div>
    </ThemeGate>
  );
}
