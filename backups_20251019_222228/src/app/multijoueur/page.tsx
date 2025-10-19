import ThemeSwitcher from '@/components/ThemeSwitcher'
import ModeSwitcher from '@/components/ModeSwitcher'
import FocusTimer from '@/components/FocusTimer'

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Multijoueur – Live</h1>
          <p className="text-muted mt-1">
            Défis courts, chat, tableau interactif, classement amical.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-3 w-full md:w-auto">
          <ThemeSwitcher />
          <ModeSwitcher />
        </div>
      </header>

      <section className="card">
        <h2 className="text-lg font-semibold">Live – Échauffement</h2>
        <p className="text-muted mb-2">Défi 3 minutes, feedback immédiat.</p>
        <FocusTimer minutes={3} />
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Salle Live</h2>
        <div className="aspect-video rounded-xl border bg-slate-100 anti-distract flex items-center justify-center">
          Player Live (à brancher)
        </div>
        <div className="mt-3 text-sm text-muted">
          Chat modéré, file de questions, sondages en cours…
        </div>
      </section>
    </main>
  )
}
