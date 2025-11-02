"use client";
import React, { useEffect, useState } from "react";
import { themeIsOwned } from "@/lib/entitlements/client";

export default function ThemeGate({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Logique actuelle: mock localStorage. Quand on branchera Stripe,
    // on remplacera par un appel API + cookie.
    const ok = themeIsOwned(slug);
    if (!ok) {
      // Upsell: renvoi panier ciblé
      window.location.replace(`/panier?theme=${encodeURIComponent(slug)}`);
      return;
    }
    setAllowed(true);
  }, [slug]);

  if (allowed === null) {
    // petit skeleton
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="animate-pulse h-8 w-48 rounded bg-slate-200 mb-4" />
        <div className="animate-pulse h-40 rounded bg-slate-100" />
      </div>
    );
  }

  return <>{children}</>;
}
