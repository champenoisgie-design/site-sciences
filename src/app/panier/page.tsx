"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const FORMULES = [
  { name: "Normal", prixMensuel: 9.9, prixAnnuel: 9.9 * 12 * 0.8 },
  { name: "Gold", prixMensuel: 14.9, prixAnnuel: 14.9 * 12 * 0.8 },
  { name: "Platine", prixMensuel: 19.9, prixAnnuel: 19.9 * 12 * 0.8 },
];

const THEMES = [
  { name: "One Piece 1", video: "/themes/onepiece/onepiece1.mp4", slug: "onepiece" },
  { name: "One Piece 4", video: "/themes/onepiece/onepiece4.mp4", slug: "onepiece" },
  { name: "Mario 1", video: "/themes/mario/mario1.mp4", slug: "mario" },
];

export default function PanierPage() {
  const [formule, setFormule] = useState("Gold");
  const [isAnnuel, setIsAnnuel] = useState(false);
  const [prix, setPrix] = useState(0);

  useEffect(() => {
    const base = FORMULES.find((f) => f.name === formule);
    const total = isAnnuel ? base!.prixAnnuel : base!.prixMensuel;
    setPrix(Number(total.toFixed(2)));
  }, [formule, isAnnuel]);

  return (
    <main className="p-6 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <h1 className="text-3xl font-bold mb-2">🎒 Mon panier</h1>
      <p className="text-gray-400 mb-6">
        Simulation d’un compte abonné avec accès complet aux vidéos.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {THEMES.map((t) => (
          <div key={t.name} className="bg-slate-700/70 p-4 rounded-2xl shadow-lg border border-slate-600">
            <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
            <video src={t.video} controls className="w-full rounded-xl mb-3" />
            <Link href={`/themes/${t.slug}`} className="text-blue-400 hover:underline">
              Voir le thème →
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-slate-700/50 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Abonnement</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-300 mb-1">Formule</span>
            <select
              value={formule}
              onChange={(e) => setFormule(e.target.value)}
              className="bg-slate-800 p-2 rounded-md"
            >
              {FORMULES.map((f) => (
                <option key={f.name}>{f.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-300 mb-1">Durée</span>
            <select
              value={isAnnuel ? "Annuel" : "Mensuel"}
              onChange={(e) => setIsAnnuel(e.target.value === "Annuel")}
              className="bg-slate-800 p-2 rounded-md"
            >
              <option>Mensuel</option>
              <option>Annuel (-20%)</option>
            </select>
          </label>
        </div>

        <div className="mt-6 text-center text-xl font-semibold">
          💰 Total : <span className="text-green-400">{prix} €</span> /{" "}
          {isAnnuel ? "an" : "mois"}
        </div>

        <div className="mt-6 text-center">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
            Paiement simulé ✅
          </button>
        </div>
      </div>
    </main>
  );
}
