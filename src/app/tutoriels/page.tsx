import ThemeSwitcher from '@/components/ThemeSwitcher'
import ModeSwitcher from '@/components/ModeSwitcher'
import Checklist from '@/components/Checklist'

export default function Page(){
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tutoriels vidéo</h1>
          <p className="text-muted mt-1">Vidéos courtes (2–5 min), chapitrées, avec quiz et fiches.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-3 w-full md:w-auto">
          <ThemeSwitcher />
          <ModeSwitcher />
        </div>
      </header>

      <Checklist items={["Regarder 1 vidéo de 3 min","Répondre au quiz"]} />

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Loi d’Ohm en 3 minutes</h2>
        <div className="aspect-video rounded-xl border bg-slate-100 anti-distract flex items-center justify-center">
          Lecteur vidéo (à brancher)
        </div>
        <p className="text-xs text-muted mt-2">Résumé : relation U = R × I, unités en SI…</p>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Produit scalaire – intuition</h2>
        <div className="aspect-video rounded-xl border bg-slate-100 anti-distract flex items-center justify-center">
          Lecteur vidéo (à brancher)
        </div>
        <p className="text-xs text-muted mt-2">Résumé : projection, angle, cosinus…</p>
      </section>
    </main>
  )
}
