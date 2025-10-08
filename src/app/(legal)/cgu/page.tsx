import type { Metadata } from "next";
export const metadata: Metadata = { title: "CGU — Site Sciences" };

export default function CGUPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Conditions Générales d’Utilisation</h1>
      <p className="mb-4">Version courte (placeholder) — à compléter avec vos conditions contractuelles.</p>
      <h2 className="mt-6 text-xl font-semibold">Accès au service</h2>
      <p className="mb-3">Accès sous abonnement, essai 3 jours possible, limitation d’appareils (1 par défaut, 2 en Famille).</p>
      <h2 className="mt-6 text-xl font-semibold">Compte et sécurité</h2>
      <p className="mb-3">Vérification OTP pour nouveaux appareils et possibilité de révocation depuis l’espace compte.</p>
      <h2 className="mt-6 text-xl font-semibold">Propriété intellectuelle</h2>
      <p className="mb-3">Contenus protégés. Toute reproduction non autorisée est interdite.</p>
      <h2 className="mt-6 text-xl font-semibold">Responsabilité</h2>
      <p className="mb-3">Service proposé “en l’état”. Limitation de responsabilité dans les limites de la loi.</p>
    </main>
  );
}
