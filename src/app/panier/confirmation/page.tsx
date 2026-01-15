import { redirect } from "next/navigation";

export default function Page() {
  // Confirmation "preview" désactivée : le panier doit aller directement sur Stripe.
  redirect("/panier");
}
