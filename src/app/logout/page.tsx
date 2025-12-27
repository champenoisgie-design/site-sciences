"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      } finally {
        window.location.href = "/";
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold">Déconnexion…</div>
          <div className="mt-2 text-sm text-slate-600">On te redirige vers l’accueil.</div>
        </div>
      </div>
    </div>
  );
}
