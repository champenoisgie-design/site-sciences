import { RequireParentPinAlways } from "@/components/parent-pin/RequireParentPinAlways";

export default function Page() {
  return (
    <RequireParentPinAlways>
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-bold">Abonnement</h1>
        <p className="text-sm text-muted-foreground">
          Zone protégée par PIN Parents. À brancher ensuite sur Stripe (Billing Portal / upgrade / cancel).
        </p>

        <div className="rounded-2xl border p-4">
          <div className="font-semibold">Statut</div>
          <div className="text-sm text-muted-foreground">—</div>
        </div>
      </div>
    </RequireParentPinAlways>
  );
}
