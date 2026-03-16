// PATCH_TAG_MODES_V1
export const metadata = {
  title: "Mode Dysgraphie | Site Sciences",
};

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Mode Dysgraphie</h1>
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
          <span>À partir de</span>
          <strong>2,99 €</strong>
        </div>
        <p className="text-lg text-gray-600 mt-6">
          Conçu pour faciliter l’expression écrite et réduire la fatigue liée à l’écriture.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-14">
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Saisie facilitée</h3>
          <p className="text-gray-700">Saisie assistée, correction douce, raccourcis utiles.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Structuration guidée</h3>
          <p className="text-gray-700">Modèles de phrases, cadres de réponse, organisation des idées.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Feedback clair</h3>
          <p className="text-gray-700">Correction non intrusive, suggestions simples, objectifs courts.</p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-6">Exemples concrets</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Rédaction assistée</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Plan simple proposé (début / milieu / fin).</li>
              <li>Mots de liaison suggérés.</li>
              <li>Aide à la relecture sans jugement.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Réponse courte guidée</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Phrase à compléter (option).</li>
              <li>Mots-clés proposés.</li>
              <li>Validation progressive.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Résumé structuré</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Mots importants identifiés.</li>
              <li>Cadre de réponse prédéfini.</li>
              <li>Aide à prioriser les idées.</li>
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
          Activer le Mode Dysgraphie
        </button>
      </div>
    </main>
  );
}
