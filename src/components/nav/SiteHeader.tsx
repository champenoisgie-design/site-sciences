"use client";

import React, { useEffect, useState } from "react";
import AuthNav from "@/components/nav/AuthNav";

type MeResponse = { user: null | { id?: string; email?: string; name?: string } };

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const user = me?.user ?? null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        const j = (await r.json()) as MeResponse;
        if (mounted) setMe(j);
      } catch {
        if (mounted) setMe({ user: null });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="/" className="font-semibold text-slate-900">
          Site Sciences
        </a>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <a className="hover:text-slate-900" href="/">Accueil</a>
          <a className="hover:text-slate-900" href="/tarifs">Tarifs</a>
          <a className="hover:text-slate-900" href="/contact">Contact</a>

          {user ? (
            <>
              <a className="hover:text-slate-900" href="/compte">Mon compte</a>
              <button
                onClick={onLogout}
                className={cn(
                  "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700",
                  "hover:bg-slate-50"
                )}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <a
              className={cn(
                "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700",
                "hover:bg-slate-50"
              )}
              href="/login"
            >
              Connexion
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
