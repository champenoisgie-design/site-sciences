import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

const KNOWN = new Set(["onepiece", "mario"]);

async function readManifest(slug: string) {
  const p = path.join(process.cwd(), "public", "themes", slug, "manifest.json");
  try {
    const txt = await fs.readFile(p, "utf8");
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!KNOWN.has(slug)) return notFound();
  const manifest = await readManifest(slug);
  if (!manifest) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-semibold mb-4">Thème: {slug}</h1>
      <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm">
        {JSON.stringify(manifest, null, 2)}
      </pre>
    </main>
  );
}
