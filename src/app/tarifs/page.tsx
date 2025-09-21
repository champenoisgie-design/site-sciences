export const metadata = {
  title: "Tarifs | Site Sciences",
  description: "Nos formules et prestations.",
};

const tiers = [
  {
    name: "Découverte",
    price: "Gratuit",
    features: ["Tutoriels publics", "Mises à jour mensuelles", "Support communautaire"],
    cta: { href: "/tutoriels", label: "Explorer" },
  },
  {
    name: "Solo",
    price: "29 € / mois",
    features: ["Tutoriels premium", "Support email prioritaire", "Exercices corrigés"],
    cta: { href: "/solo", label: "Commencer" },
    popular: true,
  },
  {
    name: "Pro",
    price: "99 € / mois",
    features: ["Sessions 1:1", "Plans personnalisés", "Accès anticipé"],
    cta: { href: "/contact", label: "Nous contacter" },
  },
];

export default function Page() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Tarifs</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-10">
        Choisissez l’offre qui correspond à vos besoins.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border p-6 ${t.popular ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-200 dark:border-zinc-800"}`}
          >
            {t.popular && (
              <div className="mb-4 w-fit rounded-full bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
                Populaire
              </div>
            )}
            <h2 className="text-xl font-semibold">{t.name}</h2>
            <p className="mt-2 text-2xl font-bold">{t.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <a
              href={t.cta.href}
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {t.cta.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
