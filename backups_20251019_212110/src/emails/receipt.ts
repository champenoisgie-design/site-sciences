export function receiptTemplate(params: {
  amount: string;  // ex "12,99 €"
  plan: string;    // ex "normal"
  period: string;  // ex "mensuel"
}) {
  const { amount, plan, period } = params;
  return {
    subject: `Reçu de paiement — ${amount}`,
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
        <h2>Merci pour votre paiement</h2>
        <p>Offre: <b>${plan}</b> — Facturation: <b>${period}</b></p>
        <p>Montant: <b>${amount}</b></p>
        <p>Ce message fait office de reçu. Vous pouvez gérer votre abonnement depuis votre compte.</p>
      </div>
    `,
    text: `Reçu de paiement\nOffre: ${plan}\nFacturation: ${period}\nMontant: ${amount}`,
  };
}
