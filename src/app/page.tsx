export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Cours MP Concret
            </h1>
            <p className="mt-4 text-slate-600 md:text-lg">
              Exercices corrigés, tutoriels vidéo et sessions live. 
              Choisis ton <span className="font-semibold">mode d’apprentissage</span> (TDAH, DYS, TSA, HPI) 
              et ton <span className="font-semibold">univers visuel</span>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/solo" className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90">
                S’entraîner maintenant
              </a>
              <a href="/tutoriels" className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50">
                Voir un tutoriel
              </a>
              <a href="/multijoueur" className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50">
                Rejoindre le live
              </a>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Extraits gratuits disponibles – pas de carte requise.
            </p>
          </div>
          <div className="rounded-2xl border bg-slate-50 aspect-video flex items-center justify-center">
            {/* Remplace cette zone par une image/illustration plus tard */}
            <span className="text-slate-500">Visuel d’accueil (à remplacer)</span>
          </div>
        </div>
      </section>

      {/* 3 CARTES */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <a href="/solo" className="p-6 rounded-2xl border hover:bg-slate-50 transition">
            <h3 className="text-lg font-semibold">Entraînement en solo</h3>
            <p className="mt-2 text-sm text-slate-600">Séries d’exercices corrigés pas à pas, indices progressifs, XP.</p>
          </a>
          <a href="/tutoriels" className="p-6 rounded-2xl border hover:bg-slate-50 transition">
            <h3 className="text-lg font-semibold">Tutoriels vidéo</h3>
            <p className="mt-2 text-sm text-slate-600">Vidéos courtes (2–5 min), chapitrées, avec quiz et fiches.</p>
          </a>
          <a href="/multijoueur" className="p-6 rounded-2xl border hover:bg-slate-50 transition">
            <h3 className="text-lg font-semibold">Multijoueur – Live</h3>
            <p className="mt-2 text-sm text-slate-600">Défis courts, chat, tableau interactif, classement amical.</p>
          </a>
        </div>
      </section>

      {/* BANDEAU TARIFS */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto p-6 border rounded-2xl text-center">
          <p className="text-slate-700">
            Abonnements <strong>Normal • Gold • Platinium</strong> + achat à la demande.
          </p>
          <a href="/tarifs" className="inline-block mt-3 px-5 py-3 rounded-xl bg-black text-white hover:opacity-90">
            Voir les tarifs
          </a>
        </div>
      </section>

      <footer className="px-6 py-10 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div>© {new Date().getFullYear()} Cours MP Concret</div>
          <nav className="flex flex-wrap gap-4">
            <a href="/mentions" className="hover:underline">Mentions légales</a>
            <a href="/cgu" className="hover:underline">CGU</a>
            <a href="/confidentialite" className="hover:underline">Confidentialité</a>
            <a href="/support" className="hover:underline">@CoursMPConcret</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
