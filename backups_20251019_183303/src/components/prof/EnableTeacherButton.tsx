// src/components/prof/EnableTeacherButton.tsx
"use client";
import { useState } from "react";
export default function EnableTeacherButton() {
  const [state, setState] = useState<"idle"|"loading"|"ok"|"ko">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  async function enable() {
    setState("loading"); setMsg(null);
    const r = await fetch("/api/prof/enable", { method:"POST" });
    const j = await r.json();
    if (r.ok && j.enabled) { setState("ok"); location.reload(); }
    else { setState("ko"); setMsg(j?.error || "forbidden"); }
  }
  return (
    <div>
      <button onClick={enable} disabled={state==="loading"} className="rounded bg-black text-white px-3 py-1 text-sm">
        {state==="loading" ? "…" : "Activer mon accès prof"}
      </button>
      {msg && <div className="mt-2 text-sm text-red-700">{msg}</div>}
    </div>
  );
}
