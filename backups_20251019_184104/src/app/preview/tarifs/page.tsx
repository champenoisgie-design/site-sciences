import CompareMonthlyAnnual from "@/components/pricing/CompareMonthlyAnnual";

export const metadata = { title: "Preview Tarifs — Site Sciences" };

export default function PreviewTarifsPage() {
  return (
    <main className="px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold">Tarifs (prévisualisation)</h1>
      <p className="mt-2 text-muted-foreground">Comparatif Mensuel vs Annuel (−20%) — non connecté au panier.</p>
      <CompareMonthlyAnnual />
    </main>
  );
}
