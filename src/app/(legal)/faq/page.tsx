import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Site Sciences",
  description: "Questions fréquentes sur l’essai, les plans, les remises, le mode Famille et la sécurité des comptes.",
};

export default function FAQPage() {
  const Q = ({ q, children }: { q: string; children: React.ReactNode }) => (
    <details className="mb-4 rounded-xl border p-4">
      <summary className="cursor-pointer text-lg font-semibold">{q}</summary>
      <div className="mt-2 text-base leading-relaxed">{children}</div>
    </details>
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">FAQ</h1>

      <Q q="Le mode acheté (ex. TDAH) s’applique-t-il partout ?">
        Oui. Le mode d’apprentissage choisi (TDAH, DYS, TSA, HPI, etc.) est <b>valable sur toutes les matières et tous les niveaux</b> de votre abonnement. Vous pouvez changer de matière et de niveau à tout moment sans coût supplémentaire.
      </Q>

      <Q q="Puis-je essayer avant de m’abonner ?">
        Oui. Nous proposons un <b>essai de 3 jours</b>. L’accès est immédiat. À l’issue de l’essai, l’abonnement démarre automatiquement, sauf annulation pendant l’essai.
      </Q>

      <Q q="Quelles remises sont disponibles ?">
        Plusieurs remises peuvent s’appliquer :<br/>
        • <b>Parrainage</b> : –5 % avec un code valide.<br/>
        • <b>Offre “100 premiers”</b> : –20 % pour les 100 premiers abonnés éligibles.<br/>
        • <b>Famille</b> : activer le mode Famille pour gérer plusieurs abonnements au sein d’un même foyer (jusqu’à <b>2 appareils actifs</b> en simultané).
      </Q>

      <Q q="Comment fonctionne la facturation ?">
        La facturation est <b>mensuelle</b> (ou annuelle si vous choisissez cette option). Les prix affichés sont <b>TTC</b>. Un <b>e-mail récapitulatif</b> est envoyé après chaque paiement.
      </Q>

      <Q q="Puis-je changer de plan ou annuler ?">
        Oui. Vous pouvez <b>changer d’offre ou annuler</b> à tout moment depuis votre compte. En cas d’annulation, l’accès reste actif <b>jusqu’à la fin de la période en cours</b>.
      </Q>

      <Q q="Combien d’appareils peuvent se connecter ?">
        Par défaut, l’accès est limité à <b>1 appareil actif</b> à la fois (ou <b>2</b> si l’option <b>Famille</b> est activée). Un nouvel appareil peut nécessiter une <b>vérification OTP</b> (code reçu par e-mail).
      </Q>

      <Q q="Que se passe-t-il si je ne sélectionne aucune matière ?">
        Le choix des matières et niveaux est <b>modifiable à tout moment</b>. Vous pouvez commencer avec une matière et en ajouter d’autres ensuite, sans supplément (dans la limite de votre plan).
      </Q>

      <Q q="Les totaux affichés sont-ils fiables ?">
        Oui. Le total affiché au panier correspond au calcul <b>côté serveur</b> (source de vérité) avec toutes les remises applicables. En production, les blocs de débogage sont masqués.
      </Q>

      <Q q="Comment sont sécurisés les comptes ?">
        Pour limiter le partage de compte, nous appliquons une <b>vérification OTP</b> pour les nouveaux appareils et une <b>limitation du nombre d’appareils actifs</b> (1 par défaut, 2 en Famille). Vous pouvez révoquer les appareils depuis votre espace compte.
      </Q>

      <Q q="Comment contacter le support ?">
        Écrivez-nous via la page <a className="underline" href="/contact">Contact</a>. Nous répondons le plus vite possible.
      </Q>
    </main>
  );
}
