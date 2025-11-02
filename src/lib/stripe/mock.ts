type CreateSessionInput = {
  plan?: "Normal" | "Gold" | "Platine";
  period?: "Mensuel" | "Annuel";
  trialDays?: number;
  // tu peux ajouter items, userId, etc.
};

export async function createMockCheckoutSession(input: CreateSessionInput) {
  // Ici on pourrait persister un "session" côté DB si besoin.
  const id = `mock_${Date.now()}`;
  const search = new URLSearchParams({
    session_id: id,
    plan: input.plan ?? "",
    period: input.period ?? "",
    trialDays: String(input.trialDays ?? 3),
  });
  return {
    id,
    url: `/merci?${search.toString()}`,
  };
}
