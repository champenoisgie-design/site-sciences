// PATCH_TAG_MODES_V1
export const metadata = {
  title: "Mode Dyslexie | Site Sciences",
};

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Mode Dyslexie</h1>
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
          <span>À partir de</span>
          <strong>2,99 €</strong>
        </div>
        <p className="text-lg text-gray-600 mt-6">
          Conçu pour faciliter la lecture, améliorer la fluidité et réduire la fatigue cognitive.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-14">
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Confort de lecture renforcé</h3>
          <p className="text-gray-700">Police adaptée, espacement optimisé, lignes aérées, contraste ajustable.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Lecture guidée</h3>
          <p className="text-gray-700">Surlignage progressif, repères visuels stables, suivi visuel intégré.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Aide à la compréhension</h3>
          <p className="text-gray-700">Définitions instantanées, reformulation simplifiée, exemples courts.</p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-6">Exemples concrets</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Lecture accompagnée</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Texte aéré avec repères visuels stables.</li>
              <li>Surlignage progressif phrase par phrase.</li>
              <li>Lecture audio optionnelle (si activée).</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Dictée intelligente</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Segmentation en syllabes (option).</li>
              <li>Correction visuelle claire et douce.</li>
              <li>Aide à la relecture sans surcharge.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Compréhension de texte</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Paragraphes courts et structurés.</li>
              <li>Questions directes, une à une.</li>
              <li>Mots-clés mis en évidence.</li>
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
          Activer le Mode Dyslexie
        </button>
      </div>
    </main>
  );
}
