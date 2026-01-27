"use client";
import React from "react";
import { PRICING } from "@/lib/pricing";
import { useRouter } from "next/navigation";

export default function PricingTable() {
  const router = useRouter();
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      {/* CTA haut de page */}
      <div className="border rounded-xl p-4 bg-gradient-to-br from-white to-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Choisissez votre niveau et votre matière</h2>
            <p className="text-gray-700">
              Offre de lancement : <b>-20% pour les 100 premiers abonnés</b> 🎉
            </p>
          </div>
          <button
            onClick={() => router.push("/panier")}
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
            aria-label="Aller au panier pour choisir niveau et matière"
          >
            Choisir mon niveau et ma matière
          </button>
        </div>
      </div>

      {/* Tableau comparatif SANS PRIX (fonctionnalités uniquement) */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3">Fonctionnalités</th>
              <th className="text-center p-3">Normal</th>
              <th className="text-center p-3">Gold</th>
              <th className="text-center p-3">Platine</th>
            </tr>
          </thead>
          <tbody>
            {(PRICING as any).features || [].map((f: any) => (
              <tr key={f.key} className="border-t">
                <td className="p-3">{f.label}</td>
                {(["normal","gold","platine"] as const).map((k) => (
                  <td key={k} className="text-center p-3">
                    {((PRICING as any).matrix?.[k]?.[f.key] ? "✅" : "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bandeau rappel add-ons */}
      <div className="text-sm text-gray-600">
        <p>
          Le prix des plans inclut uniquement le <b>mode sélectionné</b>. Les autres modes (TDAH, DYS, TSA, HPI)
          sont des <b>add-ons</b> complémentaires valables pour toutes matières et tous niveaux.
        </p>
      </div>
    </div>
  );
}
