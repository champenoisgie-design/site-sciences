import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border p-8 md:p-12 shadow-sm">
      <p className="text-sm font-semibold tracking-wide text-blue-600">Site Sciences</p>
      <h1 className="mt-2 text-3xl md:text-5xl font-bold">
        Cours & exercices adaptés à ton profil d’apprentissage
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Dès <span className="font-semibold">9,99 € / mois</span>. Modes TDAH, DYS, TSA, HPI… activables à la carte.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/preview/tarifs"
          className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Découvrir les formules
        </Link>
        <Link
          href="/preview/hero#pourquoi"
          className="inline-flex items-center rounded-xl border px-5 py-3 font-medium hover:bg-muted transition"
        >
          Pourquoi nous ?
        </Link>
      </div>

      <div id="pourquoi" className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">Apprentissages différenciés</h3>
          <p className="mt-2 text-muted-foreground">Active les modes TDAH, DYS, TSA, HPI selon tes besoins.</p>
        </div>
        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">Prix abordables</h3>
          <p className="mt-2 text-muted-foreground">À partir de 9,99 € / matière / mois. −20% en annuel.</p>
        </div>
        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold">Exercices concrets</h3>
          <p className="mt-2 text-muted-foreground">Des thèmes proches des univers que les élèves aiment.</p>
        </div>
      </div>
    </section>
  );
}
