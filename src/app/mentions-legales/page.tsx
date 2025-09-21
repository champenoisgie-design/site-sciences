export const metadata = {
  title: "Mentions légales | Site Sciences",
  description: "Informations légales de l’éditeur du site",
};
export default function Page() {
  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>Mentions légales</h1>
      <h2>Éditeur</h2>
      <p>Raison sociale / Nom, adresse, email de contact.</p>
      <h2>Hébergeur</h2>
      <p>Nom de l’hébergeur, adresse, contact.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Contenus protégés. Toute reproduction nécessite autorisation.</p>
    </article>
  );
}
