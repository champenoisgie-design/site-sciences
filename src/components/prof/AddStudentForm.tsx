// src/components/prof/AddStudentForm.tsx
"use client";
import { useState } from "react";
export default function AddStudentForm({ onAdded }:{ onAdded: ()=>void }) {
  const [email, setEmail] = useState(""); const [id, setId] = useState("");
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function add(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const body: any = {}; if (email) body.studentEmail = email; if (id) body.studentUserId = id;
    try {
      const r = await fetch("/api/prof/students", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(body) });
      const j = await r.json(); if (!r.ok) throw new Error(j?.error || "error");
      setEmail(""); setId(""); setMsg("Élève ajouté ✔︎"); onAdded();
    } catch(e:any) { setMsg(e?.message || "Erreur"); } finally { setBusy(false); }
  }
  return (
    <form onSubmit={add} className="flex flex-col md:flex-row gap-2">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email élève (optionnel)" className="border rounded px-3 py-1" />
      <input value={id} onChange={e=>setId(e.target.value)} placeholder="userId élève (optionnel)" className="border rounded px-3 py-1" />
      <button className="rounded bg-black text-white px-3 py-1 text-sm" disabled={busy}>Ajouter</button>
      {msg && <div className="text-sm">{msg}</div>}
    </form>
  );
}
