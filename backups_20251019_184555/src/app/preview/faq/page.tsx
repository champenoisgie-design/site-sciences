export const metadata = { title: "Preview FAQ — Site Sciences" };

export default function PreviewFAQPage() {
  return (
    <main className="px-6 py-10 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold">FAQ (prévisualisation)</h1>
      <section className="mt-8 space-y-6">
        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">
            Le mode acheté (TDAH, DYS, etc.) est-il valable sur toutes les matières et tous les niveaux ?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Oui. Une fois un mode activé, il s’applique à toutes les matières disponibles et à tous les niveaux de classe pris en charge par Site Sciences.
          </p>
        </article>
      </section>
    </main>
  );
}
