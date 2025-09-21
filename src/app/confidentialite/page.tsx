export const metadata = {
  title: "Confidentialité | Site Sciences",
  description: "Politique de confidentialité (RGPD)",
};
export default function Page() {
  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>Politique de confidentialité (RGPD)</h1>
      <p>Nous collectons les données strictement nécessaires à la fourniture du service :</p>
      <ul>
        <li>Données de compte : email, mot de passe (haché), prénom/nom (facultatifs).</li>
        <li>Données d’usage : sélection niveau/matière, progression, badges.</li>
        <li>Journaux techniques : IP (si fournie par l’hébergeur), user-agent, horodatage.</li>
      </ul>
      <h2>Finalités</h2>
      <p>Authentification, personnalisation, lutte anti-partage illicite, support, facturation.</p>
      <h2>Base légale</h2>
      <p>Exécution du contrat (CGU), intérêt légitime (sécurité/anti-abus), obligation légale (facturation).</p>
      <h2>Durées de conservation</h2>
      <p>Conservation pendant la durée d’abonnement + délais légaux.</p>
      <h2>Vos droits</h2>
      <p>Accès, rectification, effacement, limitation, opposition, portabilité. Contact via la page Contact.</p>
      <h2>Transferts & sous-traitants</h2>
      <p>Prestataires d’hébergement/paiement (ex. Stripe) avec engagements contractuels conformes au RGPD.</p>
      <h2>Cookies</h2>
      <p>Cookies essentiels (session), et éventuels cookies de mesure si consentement.</p>
    </article>
  );
}
