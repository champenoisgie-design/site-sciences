// src/components/xp/CompleteExerciseButton.tsx
"use client";
import { useState } from "react";

export default function CompleteExerciseButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function complete() {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/xp/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "exercise_completed" })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "error");
      setMsg(`Exercice enregistré. Streak: ${json.streak.current}`);
      // Souvent on ferait un refresh() (Next 15) pour recharger StreakPanel serveur.
      // location.reload();
    } catch (e:any) {
      setMsg(e?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="font-semibold">🎯 Démo</div>
      <p className="mt-2 text-sm text-gray-600">Clique pour simuler la fin d’un exercice (attribue “Premier pas” au 1er succès et incrémente le streak).</p>
      <button onClick={complete} disabled={loading} className="mt-3 rounded bg-black text-white px-4 py-2">
        {loading ? "..." : "Terminer un exercice (demo)"}
      </button>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
