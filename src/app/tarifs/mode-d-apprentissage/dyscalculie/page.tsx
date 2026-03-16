// PATCH_TAG_MODES_V1
export const metadata = {
  title: "Mode Dyscalculie | Site Sciences",
};

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Mode Dyscalculie</h1>
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
          <span>À partir de</span>
          <strong>2,99 €</strong>
        </div>
        <p className="text-lg text-gray-600 mt-6">
          Conçu pour rendre les mathématiques plus visuelles, progressives et rassurantes.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-14">
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Visualisation renforcée</h3>
          <p className="text-gray-700">Schémas explicites, représentations claires, manipulation visuelle.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Progression structurée</h3>
          <p className="text-gray-700">Un seul type d’exercice par écran, répétition guidée, feedback immédiat.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Aide contextuelle</h3>
          <p className="text-gray-700">Rappels de méthode, exemples résolus, erreurs expliquées simplement.</p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-6">Exemples concrets</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Addition fractionnée</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Décomposition en étapes visibles.</li>
              <li>Une opération à la fois.</li>
              <li>Validation étape par étape.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Problème guidé</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Données mises en évidence.</li>
              <li>Résolution en 3 étapes maximum.</li>
              <li>Méthode rappelée juste au bon moment.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Géométrie visuelle</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Figures lisibles et stables.</li>
              <li>Mesures affichées clairement.</li>
              <li>Manipulation avant réponse.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
        <div className="space-y-3">
          <div className="p-4 border rounded-xl">Est-ce compatible avec toutes les matières ?</div>
          <div className="p-4 border rounded-xl">Peut-on revenir au mode Normal ?</div>
        </div>
      </section>

      <div className="text-center">
        <button className="px-6 py-3 rounded-xl bg-black text-white">
          Activer le Mode Dyscalculie
        </button>
      </div>
    </main>
  );
}
