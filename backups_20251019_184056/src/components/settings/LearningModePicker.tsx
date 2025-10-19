// src/components/settings/LearningModePicker.tsx
"use client";
import { useEffect, useState } from "react";

const OPTIONS = [
  { v:"normal", label:"Normal" },
  { v:"tdah",   label:"TDAH" },
  { v:"dys",    label:"Dys" },
  { v:"tsa",    label:"TSA" },
  { v:"hpi",    label:"HPI" },
] as const;

export default function LearningModePicker() {
  const [mode, setMode] = useState<string>("normal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true); setMsg(null);
    try {
      const r = await fetch("/api/settings/learning-mode", { cache:"no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "error");
      setMode(j.mode || "normal");
    } catch(e:any) {
      setMsg(e?.message || "Erreur de chargement");
    } finally { setLoading(false); }
  }

  async function save(next:string) {
    setSaving(true); setMsg(null);
    try {
      const r = await fetch("/api/settings/learning-mode", {
        method:"POST", headers:{ "content-type":"application/json" },
        body: JSON.stringify({ mode: next })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "error");
      setMode(j.mode);
      setMsg("Préférences enregistrées ✔︎");
    } catch(e:any) {
      setMsg(e?.message || "Erreur d’enregistrement");
    } finally { setSaving(false); }
  }

  useEffect(()=>{ load(); }, []);

  if (loading) return <div className="text-sm text-gray-600">Chargement…</div>;
  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="font-semibold">Mode d’apprentissage</div>
      <p className="mt-1 text-sm text-gray-600">
        Choisis un mode d’accompagnement adapté (modifiable à tout moment).
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        {OPTIONS.map(o=>(
          <label key={o.v} className="flex items-center gap-2 rounded border px-3 py-2">
            <input
              type="radio"
              name="learningMode"
              checked={mode===o.v}
              onChange={()=> save(o.v)}
              disabled={saving}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
