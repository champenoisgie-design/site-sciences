import purchases from "@/content/purchases.json";

type Purchase = {
  id: string;
  date: string;            // ISO yyyy-mm-dd
  item: string;
  period: "mensuel" | "annuel";
  amount: number;
  status: "paid" | "trial" | "canceled";
  provider: "stripe" | "gocardless";
};

export const dynamic = "force-static";

function Badge({ status }: { status: Purchase["status"] }) {
  const map: Record<Purchase["status"], string> = {
    paid: "bg-green-600/10 text-green-400 border-green-600/30",
    trial: "bg-yellow-600/10 text-yellow-400 border-yellow-600/30",
    canceled: "bg-red-600/10 text-red-400 border-red-600/30",
  };
  return (
    <span className={"px-2 py-1 text-xs rounded border " + map[status]}>
      {status === "paid" ? "Payé" : status === "trial" ? "Essai" : "Annulé"}
    </span>
  );
}

export default function Page() {
  const list = (purchases as Purchase[]).sort((a,b)=>a.date < b.date ? 1 : -1);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-2">Historique des achats</h1>
      <p className="opacity-70 mb-6">
        Données de démonstration tant que Stripe / GoCardless ne sont pas finalisés.
      </p>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Article</th>
              <th className="p-3">Période</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Presta.</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{new Date(p.date).toLocaleDateString("fr-FR")}</td>
                <td className="p-3">{p.item}</td>
                <td className="p-3 capitalize">{p.period}</td>
                <td className="p-3">{p.amount.toFixed(2)} €</td>
                <td className="p-3"><Badge status={p.status} /></td>
                <td className="p-3 capitalize">{p.provider}</td>
                <td className="p-3">
                  <button className="px-3 py-1 rounded bg-slate-900 text-white text-xs">
                    Télécharger la facture (mock)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
