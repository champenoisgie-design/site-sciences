// src/app/checkout/cancel/page.tsx
export default function CancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Paiement annulé</h1>
      <p className="mt-3 text-gray-600">Aucun débit n’a été effectué. Tu peux réessayer ou choisir un autre plan.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <a href="/panier" className="rounded-lg border px-5 py-3 inline-block">Retour au panier</a>
        <a href="/tarifs" className="rounded-lg underline px-5 py-3 inline-block">Voir les tarifs</a>
      </div>
    </main>
  );
}
