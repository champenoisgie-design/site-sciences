import { requireUserOrRedirect } from "@/lib/server-auth";
import CompteClient from "./CompteClient";

export const metadata = {
  title: "Mon compte | Site Sciences",
};

export default async function ComptePage() {
  const user = await requireUserOrRedirect();

  // Si pas d'utilisateur (cas limite), on affiche quand même quelque chose de propre
  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
        <p className="text-sm text-muted-foreground">
          Vous devez être connecté pour accéder à cette page.
        </p>
      </main>
    );
  }

  return <CompteClient user={user} />;
}
