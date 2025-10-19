"use client";
import React from "react";

/**
 * Ce slot tente d'importer dynamiquement le composant du sélecteur de mode.
 * Mets à jour le chemin CI-DESSOUS si ton grep a trouvé un autre fichier.
 */
let Selector: React.ComponentType<any> | null = null;
try {
  // 🔧 <- ADAPTE ce chemin si besoin (selon le résultat du grep)
  // Exemples possibles dans ton app :
  //   "@/components/learning/LearningModeSelector"
  //   "@/src/components/learning/LearningModeSelector"
  //   "@/components/learning/ModeSelector"
  //   "@/components/LearningModeSelector"
  // @ts-ignore - résolu à l’exécution
  Selector = require("@/components/learning/LearningModeSelector").default;
} catch (e) {
  try {
    // deuxième tentative courante
    // @ts-ignore
    Selector = require("@/src/components/learning/LearningModeSelector").default;
  } catch {}
}
export default function LearningModePickerSlot() {
  if (!Selector) return null; // si on ne le trouve pas, on n'affiche rien
  return <Selector />;
}
