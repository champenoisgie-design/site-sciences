"use client";

import * as React from "react";
import { ParentPinDebugWidget } from "@/components/parent-pin/ParentPinDebugWidget";

export default function DebugPinPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Debug PIN Parents</h1>
      <p className="mt-2 text-sm text-gray-600">
        Cette page sert uniquement à vérifier que le modal PIN s’ouvre et que /api/parent-pin/verify fonctionne.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-4">
        <div className="text-sm font-semibold">Instructions</div>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          <li>Expire le PIN (commande sqlite) si besoin</li>
          <li>Clique “Ouvrir PIN” en bas à droite</li>
          <li>Entre 1234 → Valider</li>
        </ul>
      </div>

      <ParentPinDebugWidget />
    </div>
  );
}
