"use client";
import { useState } from "react";

export default function PasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null); setMsg(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur inconnue");
      setMsg("Mot de passe mis à jour ✅");
      setCurrent(""); setNext("");
    } catch (e:any) {
      setErr(e.message || "Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Changer le mot de passe</h1>

      <form onSubmit={onSubmit} className="rounded-2xl border p-4 max-w-xl space-y-4">
        <div>
          <label className="block text-sm mb-1">Mot de passe actuel</label>
          <input type="password" value={current} onChange={e=>setCurrent(e.target.value)}
                 className="w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Nouveau mot de passe (min. 8)</label>
          <input type="password" value={next} onChange={e=>setNext(e.target.value)}
                 className="w-full rounded-md border px-3 py-2" minLength={8} required />
        </div>
        <button disabled={loading} className="rounded-xl border px-4 py-2">
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
        <p className="text-xs text-zinc-500">
          Par sécurité, vos autres appareils pourront nécessiter une reconnexion.
        </p>
        {msg && <div className="text-sm text-green-600">{msg}</div>}
        {err && <div className="text-sm text-red-600">{err}</div>}
      </form>
    </section>
  );
}
