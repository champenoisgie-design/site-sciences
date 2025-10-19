"use client";
import React from "react";
import PricingTable from "@/components/pricing/PricingTable";

export default function TabsShell(_props: any) {
  // Simplification: on affiche juste la table de comparaison actuelle
  return (
    <div className="py-6">
      <PricingTable />
    </div>
  );
}
