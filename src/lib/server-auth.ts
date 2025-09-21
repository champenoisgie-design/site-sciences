import { getCurrentUser } from "@/lib/auth"

export async function requireUserOrRedirect() {
  // Pour l’instant, renvoie simplement l’utilisateur ou null (pas de redirection forcée côté serveur)
  const user = await getCurrentUser()
  return user
}
