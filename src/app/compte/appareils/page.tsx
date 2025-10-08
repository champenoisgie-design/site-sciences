// src/app/compte/appareils/page.tsx
import DevicesTable from "@/components/security/DevicesTable";
import { getSessionUser } from "@/lib/auth";

export default async function AppareilsPage() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Appareils connectés</h1>
        <p className="mt-2">Veuillez vous connecter.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Appareils connectés</h1>
      <p className="mt-2 text-gray-600">Par défaut, 1 session simultanée (2 avec le mode Famille).</p>
      <div className="mt-6"><DevicesTable /></div>
    </main>
  );
}
