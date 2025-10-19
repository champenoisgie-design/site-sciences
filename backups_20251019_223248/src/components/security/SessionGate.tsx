// src/components/security/SessionGate.tsx
"use client";
import { useEffect, useState } from "react";

export default function SessionGate() {
  const [state, setState] = useState<{ otpRequired?: boolean; err?: string; max?: number } | null>(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    heartbeat();
    const t = setInterval(heartbeat, 120000);
    return () => clearInterval(t);
  }, []);

  async function heartbeat() {
    try {
      const res = await fetch("/api/session/heartbeat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
      });
      if (res.status === 409) {
        const j = await res.json();
        setState({ err: "too_many", max: j?.maxSessions || 1 });
      } else {
        const j = await res.json();
        if (j?.otpRequired) setState({ otpRequired: true });
        else setState(null);
      }
    } catch (e:any) {
      setState({ err: e?.message || "network_error" });
    }
  }

  async function confirmOtp(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/session/confirm-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: otp, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    });
    if (res.ok) { setOtp(""); setState(null); heartbeat(); }
    else { setState({ otpRequired: true, err: "invalid_code" }); }
  }

  async function evictOthers() {
    await fetch("/api/session/evict-others", { method: "POST" });
    setState(null);
    heartbeat();
  }

  if (state?.otpRequired) {
    return (
      <div className="w-full bg-amber-50 border-b border-amber-200">
        <div className="mx-auto max-w-6xl px-6 py-3 text-sm">
          <div className="font-semibold">🔐 Confirme ton nouvel appareil</div>
          <p className="mt-1">Un code t'a été envoyé (démo: log serveur). Saisis-le ci-dessous.</p>
          <form onSubmit={confirmOtp} className="mt-2 flex gap-2">
            <input value={otp} onChange={(e)=>setOtp(e.target.value)} inputMode="numeric" pattern="\\d*" maxLength={6}
              className="border rounded px-3 py-1" placeholder="Code à 6 chiffres" required />
            <button className="rounded bg-black text-white px-3 py-1">Valider</button>
          </form>
          {state.err === "invalid_code" && <p className="mt-1 text-red-700">Code invalide ou expiré.</p>}
        </div>
      </div>
    );
  }

  if (state?.err === "too_many") {
    return (
      <div className="w-full bg-rose-50 border-b border-rose-200">
        <div className="mx-auto max-w-6xl px-6 py-3 text-sm flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Trop de sessions actives</div>
            <p>Ton compte est limité à {state.max} appareil(s). Déconnecte un autre appareil pour continuer.</p>
          </div>
          <button onClick={evictOthers} className="rounded bg-rose-600 text-white px-3 py-1">Déconnecter les autres</button>
        </div>
      </div>
    );
  }

  return null;
}
