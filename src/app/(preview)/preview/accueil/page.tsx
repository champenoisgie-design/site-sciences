import React from "react";

export const metadata = { title: "Aperçu — Site Sciences" };

export default async function PreviewAccueilPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section className="rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow">Aperçu gratuit</h1>
        <p className="mt-3 max-w-2xl text-white/90">
          La vidéo tourne en arrière-plan. Découvre l’expérience avant d’acheter.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="/panier" className="rounded-xl bg-white/90 text-black px-4 py-2 font-semibold hover:bg-white">Aller au panier</a>
          <a href="/tarifs" className="rounded-xl bg-black/60 px-4 py-2 font-semibold hover:bg-black/70">Voir les tarifs</a>
        </div>
      </section>
    </div>
  );
}
