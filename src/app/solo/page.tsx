import ThemeSwitcher from '@/components/ThemeSwitcher'
import ModeSwitcher from '@/components/ModeSwitcher'
import Checklist from '@/components/Checklist'
import FocusTimer from '@/components/FocusTimer'

export default function Page(){
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Entraînement en solo</h1>
          <p className="text-muted mt-1">Objectifs courts, indices progressifs, XP.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3 w-full md:w-auto">
          <ThemeSwitcher />
          <ModeSwitcher />
        </div>
      </header>

      <Checklist />

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Exercice 1 – Fractions</h2>
        <p className="text-muted">Simplifie 6/9.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary">Commencer</button>
          <button className="btn">Voir un indice</button>
        </div>
        <FocusTimer minutes={5} />
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Exercice 2 – Dérivées</h2>
        <p className="text-muted">Calcule f’(x) si f(x)=3x²−5x+2.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary">Commencer</button>
          <button className="btn">Voir un indice</button>
        </div>
        <FocusTimer minutes={7} />
      </section>
    </main>
  )
}
