import type { Metadata } from "next";
export const metadata: Metadata = { title: "Mentions légales — Site Sciences" };

export default function MentionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Mentions légales</h1>
      <p className="mb-3">Éditeur: Société XYZ — adresse — SIREN — contact.</p>
      <p className="mb-3">Hébergeur: Vercel (ou autre) — coordonnées.</p>
    </main>
  );
}
