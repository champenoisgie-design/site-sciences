export const metadata = { title: "Politique de confidentialité (RGPD)" };

export default function Page() {
  return (
    <main className="prose mx-auto px-4 py-10">
      <h1>Politique de confidentialité</h1>
      <p>Dernière mise à jour : 19 octobre 2025</p>
      <h2>Données collectées</h2>
      <ul>
        <li>Identité : email, prénom/nom (si fournis).</li>
        <li>Données d’usage : progression, réponses aux exercices.</li>
        <li>Paiements : gérés par Stripe/GoCardless (pas de conservation complète des moyens de paiement sur nos serveurs).</li>
      </ul>
      <h2>Finalités</h2>
      <p>Fourniture du service, facturation, lutte contre la fraude, amélioration pédagogique.</p>
      <h2>Bases légales</h2>
      <p>Exécution du contrat, intérêt légitime d’amélioration, consentement (cookies analytiques).</p>
      <h2>Droits</h2>
      <p>Accès, rectification, suppression, opposition, portabilité : via la page Contact.</p>
      <h2>Conservation</h2>
      <p>Durées proportionnées aux finalités et obligations légales.</p>
    </main>
  );
}
