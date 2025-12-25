"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";

function money(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function parseItems(raw: string | null) {
  if (!raw) return [];
  return raw.split("|").map((x) => {
    const [level, subject] = x.split(":");
    return { level: level || "—", subject: subject || "—" };
  });
}

export default function PreviewConfirmation() {
  const sp = useSearchParams();

  const plan = sp.get("plan") || "—";
  const mode = sp.get("mode") || "—";
  const duration = sp.get("duration") || "—";

  const items = useMemo(() => parseItems(sp.get("items")), [sp]);
  const upsells = (sp.get("upsells") || "").split(",").filter(Boolean);

  const theme = sp.get("theme") || "—";
  const skin = sp.get("skin") || "—";

  const learning = sp.get("learning") || "—";
  const pace = sp.get("pace") || "—";
  const audio = sp.get("audio") === "1" ? "on" : sp.get("audio") === "0" ? "off" : "—";

  const chapters = (sp.get("chapters") || "").split(",").filter(Boolean);
  const chaptersTotalRaw = sp.get("chapters_total");
  const chaptersTotal = chaptersTotalRaw ? Number(chaptersTotalRaw) : null;

  const source = sp.get("source") || "—";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-7">
          <div className="text-sm text-slate-400">Confirmation</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">✅ Confirmation</h1>
          <p className="mt-2 text-slate-300">Récap complet (query params) pour valider le tunnel.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
              <div className="text-sm font-semibold">Abonnement</div>
              <div className="mt-3 space-y-1 text-sm text-slate-300">
                <div><span className="text-slate-400">Plan :</span> {plan}</div>
                <div><span className="text-slate-400">Mode :</span> {mode}</div>
                <div><span className="text-slate-400">Durée :</span> {duration}</div>
              </div>

              <div className="mt-4 border-t border-slate-800 pt-4">
                <div className="text-sm font-semibold">Matières / niveaux</div>
                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  {items.length ? items.map((it, i) => (
                    <div key={i}>• {it.subject} — {it.level}</div>
                  )) : <div className="text-slate-400">—</div>}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
              <div className="text-sm font-semibold">Personnalisation</div>
              <div className="mt-3 space-y-1 text-sm text-slate-300">
                <div><span className="text-slate-400">Thème :</span> {theme}</div>
                <div><span className="text-slate-400">Skin :</span> {skin}</div>
              </div>

              <div className="mt-4 border-t border-slate-800 pt-4">
                <div className="text-sm font-semibold">Mode d’apprentissage</div>
                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  <div><span className="text-slate-400">Mode :</span> {learning}</div>
                  <div><span className="text-slate-400">Rythme :</span> {pace}</div>
                  <div><span className="text-slate-400">Audio :</span> {audio}</div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-800 pt-4">
                <div className="text-sm font-semibold">Options</div>
                <div className="mt-2 text-sm text-slate-300">
                  {upsells.length ? upsells.map((u) => <div key={u}>• {u}</div>) : <div className="text-slate-400">—</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/30 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold">Achat par chapitre</div>
                <div className="mt-2 text-sm text-slate-300">
                  {chapters.length ? chapters.map((c) => <span key={c} className="mr-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs">{c}</span>) : <span className="text-slate-400">—</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Total chapitres (unique)</div>
                <div className="mt-1 text-xl font-semibold">{chaptersTotal === null ? "—" : money(chaptersTotal)}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            source: {source} • (preview)
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              href={`/preview/tarifs?mode=${mode}`}
            >
              ← Retour Tarifs
            </a>
            <a
              className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600"
              href="/preview/accueil"
            >
              Accueil Preview
            </a>
            <a
              className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600"
              href={`/preview/previewpanier3?plan=${plan}&mode=${mode}`}
            >
              Modifier panier
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
