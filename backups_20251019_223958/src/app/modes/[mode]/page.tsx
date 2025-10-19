import { notFound } from "next/navigation";

const KNOWN = new Set(["tdah", "dys", "tsa", "hpi", "parents"]);

export const metadata = { title: "Aperçu du mode d’apprentissage" };

export default function Page({ params }: { params: { mode: string } }) {
  const { mode } = params;
  if (!KNOWN.has(mode)) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Mode “{mode.toUpperCase()}”</h1>
      <ul className="list-disc pl-6 space-y-2">
        {mode === "tdah" && (
          <>
            <li>Blocs courts, objectifs visibles, feedback immédiat.</li>
            <li>Animations limitées, minuterie simple.</li>
          </>
        )}
        {mode === "dys" && (
          <>
            <li>Police lisible, interlignage augmenté.</li>
            <li>Consignes simplifiées, étapes numérotées.</li>
          </>
        )}
        {mode === "tsa" && (
          <>
            <li>Structure très prévisible, navigation épurée.</li>
            <li>Réduction des stimuli visuels.</li>
          </>
        )}
        {mode === "hpi" && (
          <>
            <li>Défis avancés, accélération du rythme.</li>
            <li>Explications synthétiques + approfondissements.</li>
          </>
        )}
        {mode === "parents" && (
          <>
            <li>Erreurs fréquentes & conseils ciblés.</li>
            <li>Progression hebdo, fiches méthodo & parcours conseillés.</li>
          </>
        )}
      </ul>
      <p className="opacity-70 text-sm">Cette page sert de démo. Les exercices s’adapteront à ce mode.</p>
    </main>
  );
}
