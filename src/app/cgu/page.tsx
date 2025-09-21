export const metadata = {
  title: "CGU | Site Sciences",
  description: "Conditions Générales d’Utilisation",
};
export default function Page() {
  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>Conditions Générales d’Utilisation (CGU)</h1>
      <p>Version du {new Date().toLocaleDateString("fr-FR")}.</p>
      <h2>1. Objet</h2>
      <p>Le présent document encadre l’utilisation du site et des services ...</p>
      <h2>2. Comptes et accès</h2>
      <ul>
        <li>Un compte est personnel et non cessible.</li>
        <li>Une seule connexion simultanée par compte est autorisée (politique “single-session”).</li>
        <li>Tout partage de comptes est prohibé.</li>
      </ul>
      <h2>3. Propriété intellectuelle</h2>
      <p>Les contenus (textes, exercices, médias) sont protégés. Toute reproduction ou rediffusion non autorisée est interdite.</p>
      <h2>4. Sécurité et usage</h2>
      <ul>
        <li>Journalisation technique (IP/UA/date) pour prévenir les abus.</li>
        <li>Filigranes/mesures anti-partage peuvent être utilisés.</li>
        <li>L’outil ne peut empêcher techniquement la capture d’écran côté utilisateur.</li>
      </ul>
      <h2>5. Abonnements et facturation</h2>
      <p>Les prix, remises “3 matières” et packs famille sont indiqués sur la page Tarifs. La résiliation prend effet à la fin de la période en cours.</p>
      <h2>6. Contact</h2>
      <p>Pour toute question : page Contact.</p>
    </article>
  );
}
