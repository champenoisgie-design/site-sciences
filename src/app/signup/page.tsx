"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const r = useRouter();
  function mockSignup(e: React.FormEvent) {
    e.preventDefault();
    try { localStorage.setItem("__mock_auth__", "1"); } catch {}
    r.push("/");
  }
  return (
    <section className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Créer un compte</h1>
      <form onSubmit={mockSignup} className="space-y-3">
        <input placeholder="Email" className="w-full rounded border px-3 py-2 bg-transparent" />
        <input type="password" placeholder="Mot de passe" className="w-full rounded border px-3 py-2 bg-transparent" />
        <button className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">Créer</button>
      </form>
      <p className="mt-3 text-xs text-zinc-500">Démo : aucune vérification serveur, stockage local.</p>
    </section>
  );
}
