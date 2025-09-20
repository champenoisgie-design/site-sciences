export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10">
<<<<<<< HEAD
        <div className="rounded-lg p-8" style={{
=======
        <div className="rounded-xl p-8" style={{
>>>>>>> 172b635 (fix(tailwind): use rounded-lg to avoid unknown utility in build)
          background: 'linear-gradient(135deg, rgba(44,194,255,.12), rgba(15,23,42,.06))'
        }}>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Cours MP Concret
          </h1>
          <p className="text-muted max-w-2xl">
            Exercices corrigés, tutoriels vidéo et sessions live. Choisis ton mode d’apprentissage (TDAH, DYS, TSA, HPI) et ton univers visuel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/solo" className="btn-primary">S’entraîner maintenant</a>
            <a href="/tutoriels" className="btn">Voir un tutoriel</a>
            <a href="/multijoueur" className="btn">Rejoindre le live</a>
          </div>

          <div className="mt-3 text-sm text-muted">
            Extraits gratuits disponibles – pas de carte requise.
          </div>
        </div>
      </section>

      {/* GRID DE CARTES */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="card">
            <h3 className="font-semibold text-lg mb-1">Entraînement en solo</h3>
            <p className="text-muted mb-4">Séries d’exercices corrigés pas à pas, indices progressifs, XP.</p>
            <a href="/solo" className="btn">Commencer</a>
          </article>

          <article className="card">
            <h3 className="font-semibold text-lg mb-1">Tutoriels vidéo</h3>
            <p className="text-muted mb-4">Vidéos courtes (2–5 min), chapitrées, avec quiz et fiches.</p>
            <a href="/tutoriels" className="btn">Parcourir</a>
          </article>

          <article className="card">
            <h3 className="font-semibold text-lg mb-1">Multijoueur – Live</h3>
            <p className="text-muted mb-4">Défis courts, chat, tableau interactif, classement amical.</p>
            <a href="/multijoueur" className="btn">Voir les lives</a>
          </article>
        </div>

        <div className="mt-10 card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="font-semibold">Abonnements Normal • Gold • Platinium</h4>
              <p className="text-muted text-sm">+ achat à la demande.</p>
            </div>
            <a href="/tarifs" className="btn-primary">Voir les tarifs</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{borderColor: 'rgb(var(--border))'}}>
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-muted flex flex-wrap items-center gap-4">
          <span>© 2025 Cours MP Concret</span>
          <a className="hover:underline" href="/mentions">Mentions légales</a>
          <a className="hover:underline" href="/cgu">CGU</a>
          <a className="hover:underline" href="/confidentialite">Confidentialité</a>
          <a className="hover:underline" href="https://instagram.com/CoursMPConcret" target="_blank" rel="noreferrer">@CoursMPConcret</a>
        </div>
      </footer>
    </main>
  )
}
