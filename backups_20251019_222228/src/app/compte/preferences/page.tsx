// src/app/compte/preferences/page.tsx
import LearningModePicker from "@/components/settings/LearningModePicker";
import { getSessionUser } from "@/lib/auth";
import { getLearningMode } from "@/lib/settings";
import { hasFamilyMode } from "@/lib/session-guard";
import Link from "next/link";

export default async function PreferencesPage() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Préférences</h1>
        <p className="mt-2">Veuillez vous connecter.</p>
      </main>
    );
  }
  const mode = await getLearningMode(user.id);
  const family = await hasFamilyMode(user.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Préférences</h1>
      <p className="mt-2 text-gray-600">
        Compte: <span className="font-mono">{user.email ?? user.id}</span> — Mode actuel: <strong>{mode}</strong> — Famille: <strong>{family ? "activé" : "non"}</strong>
      </p>

      <div className="mt-6 grid gap-4">
        <LearningModePicker />
        <div className="rounded-xl border p-4 bg-white">
          <div className="font-semibold">Sécurité</div>
          <p className="mt-1 text-sm text-gray-600">Gère les appareils connectés et déconnecte les sessions à distance.</p>
          <Link href="/compte/appareils" className="mt-2 inline-block rounded bg-black text-white px-3 py-1 text-sm">
            Appareils connectés
          </Link>
        </div>

        <div className="rounded-xl border p-4 bg-white">
          <div className="font-semibold">Facturation</div>
          <p className="mt-1 text-sm text-gray-600">Met à jour ton moyen de paiement ou annule depuis le portail Stripe.</p>
          <a href="/api/billing/portal" className="mt-2 inline-block rounded bg-black text-white px-3 py-1 text-sm">
            Gérer ma facturation
          </a>
          <p className="mt-2 text-xs text-gray-500">Nécessite un abonnement Stripe actif lié à ce compte.</p>
        </div>
      </div>
    </main>
  );
}
