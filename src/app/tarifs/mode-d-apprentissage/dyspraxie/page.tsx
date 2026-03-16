// PATCH_TAG_MODES_V1
export const metadata = {
  title: "Mode Dyspraxie | Site Sciences",
};

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Mode Dyspraxie</h1>
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
          <span>À partir de</span>
          <strong>2,99 €</strong>
        </div>
        <p className="text-lg text-gray-600 mt-6">
          Conçu pour alléger la charge motrice et faciliter l’organisation des tâches.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-14">
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Interface simplifiée</h3>
          <p className="text-gray-700">Moins d’éléments à l’écran, gros boutons, navigation stable.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Séquençage clair</h3>
          <p className="text-gray-700">Tâches fractionnées, instructions numérotées, progression visible.</p>
        </div>
        <div className="p-6 border rounded-2xl">
          <h3 className="font-semibold text-lg mb-2">Assistance visuelle</h3>
          <p className="text-gray-700">Icônes explicites, schémas fixes, repères permanents.</p>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-3xl font-bold mb-6">Exemples concrets</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Exercice structuré</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Une consigne à la fois.</li>
              <li>Boutons larges et espacés.</li>
              <li>Confirmation visuelle avant validation.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Organisation guidée</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Étapes numérotées simples.</li>
              <li>Cases à cocher pour suivre l’avancement.</li>
              <li>Retour facile en arrière.</li>
            </ul>
          </div>
          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold mb-3">Géométrie assistée</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Schémas fixes, lisibles.</li>
              <li>Moins de manipulation fine requise.</li>
              <li>Aide visuelle continue.</li>
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
          Activer le Mode Dyspraxie
        </button>
      </div>
    </main>
  );
}
