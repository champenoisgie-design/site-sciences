import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import ThemeShowcase from "@/components/themes/ThemeShowcase";

const KNOWN = new Set(["onepiece", "mario"]);

async function readManifest(slug: string) {
  const filePath = path.join(process.cwd(), "public", "themes", slug, "manifest.json");
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ Next 15 : params est asynchrone
  if (!KNOWN.has(slug)) return notFound();

  const manifest = await readManifest(slug);
  if (!manifest) return notFound();

  return <ThemeShowcase manifest={manifest} />;
}
