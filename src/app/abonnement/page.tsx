import { redirect } from "next/navigation";

export default function Page() {
  // Page de test retirée du flow. On garde l'URL mais on redirige vers Mon compte.
  redirect("/compte?tab=abonnement");
}
