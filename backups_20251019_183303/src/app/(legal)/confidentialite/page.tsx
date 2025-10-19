import type { Metadata } from "next";
export const metadata: Metadata = { title: "Confidentialité — Site Sciences" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Politique de Confidentialité</h1>
      <p className="mb-4">Résumé (placeholder) — à compléter.</p>
      <h2 className="mt-6 text-xl font-semibold">Données collectées</h2>
      <ul className="mb-3 list-disc pl-5">
        <li>Identifiants de compte (email, nom si fourni).</li>
        <li>Journaux d’activité d’apprentissage (streak, badges, événements).</li>
        <li>Appareils connectés (device hash) pour la sécurité.</li>
      </ul>
      <h2 className="mt-6 text-xl font-semibold">Finalités</h2>
      <p className="mb-3">Fourniture du service, sécurité des comptes, facturation, amélioration du produit.</p>
      <h2 className="mt-6 text-xl font-semibold">Conservation</h2>
      <p className="mb-3">Durées conformes aux obligations légales et aux finalités déclarées.</p>
      <h2 className="mt-6 text-xl font-semibold">Vos droits</h2>
      <p className="mb-3">Accès, rectification, suppression, portabilité. Contactez-nous via la page <a className="underline" href="/contact">Contact</a>.</p>
    </main>
  );
}
