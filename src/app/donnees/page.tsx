export const metadata = {
  title: 'Données & RGPD | Site Sciences',
  description: 'Information sur les traitements et droits.',
}

export default function Page() {
  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>Données & RGPD</h1>
      <h2>Responsable de traitement</h2>
      <p>Identité de l’éditeur. Contact DPO si applicable.</p>
      <h2>Mesures de sécurité</h2>
      <ul>
        <li>Hash sécurisé des mots de passe (ex : bcrypt, argon2).</li>
        <li>Sessions signées en cookie httpOnly.</li>
        <li>
          Journalisation des connexions (IP, UA, device) et détection d’abus.
        </li>
        <li>
          Limitation à une session active par compte via stockage serveur (ex:
          Redis).
        </li>
      </ul>
      <h2>Transferts hors UE</h2>
      <p>
        Le cas échéant, encadrements contractuels (clauses types) et garanties.
      </p>
      <h2>Exercer vos droits</h2>
      <p>Adresse de contact dédiée pour les demandes d’accès/suppression.</p>
    </article>
  )
}
