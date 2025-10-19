// src/app/checkout/success/page.tsx
export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">🎉 Paiement confirmé</h1>
      <p className="mt-3 text-gray-600">Ton abonnement est activé. Tu peux retourner aux cours.</p>
      <div className="mt-6">
        <a href="/" className="rounded-lg bg-black text-white px-5 py-3 inline-block">Retour à l’accueil</a>
      </div>
    </main>
  );
}
