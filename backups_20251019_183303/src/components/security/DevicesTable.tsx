// src/components/security/DevicesTable.tsx
"use client";
import { useEffect, useState } from "react";

type Item = { id:string; userAgent:string|null; ip:string|null; createdAt:string; lastSeenAt:string; isCurrent:boolean };

export default function DevicesTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/session/devices", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "error");
      setItems(j.items || []);
    } catch(e:any) {
      setErr(e?.message || "network_error");
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  async function revoke(id: string) {
    await fetch("/api/session/devices", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action:"revoke", id }) });
    load();
  }
  async function revokeOthers() {
    await fetch("/api/session/devices", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action:"revoke_others" }) });
    load();
  }

  if (loading) return <div className="text-sm text-gray-600">Chargement…</div>;
  if (err) return <div className="text-sm text-red-700">{err}</div>;

  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">Appareils connectés</div>
        <button onClick={revokeOthers} className="text-sm underline">Déconnecter les autres</button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr><th className="py-2">Appareil</th><th>IP</th><th>Dernière activité</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="py-2">{it.userAgent || "—"} {it.isCurrent && <span className="ml-2 text-xs px-1.5 py-0.5 border rounded">Cet appareil</span>}</td>
                <td>{it.ip || "—"}</td>
                <td>{new Date(it.lastSeenAt).toLocaleString()}</td>
                <td className="text-right">
                  {!it.isCurrent && <button className="text-sm underline" onClick={()=>revoke(it.id)}>Déconnecter</button>}
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td className="py-3 text-gray-600" colSpan={4}>Aucune session active</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
