// src/app/cours/page.tsx
import StreakPanel from "../../components/xp/StreakPanel";
import CompleteExerciseButton from "../../components/xp/CompleteExerciseButton";

export default function CoursesHome() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Espace cours</h1>
      <p className="mt-2 text-gray-600">Tu as accès au contenu protégé (trial actif ou abonnement payant).</p>
      <div className="mt-6 grid gap-3">
        <a href="/api/memo/issue?subject=Maths&level=2nde&chapter=Equations" className="underline">Générer une fiche mémo (exemple)</a>
      </div>
    
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <StreakPanel />
        <CompleteExerciseButton />
      </div>
    </main>
  );
}
