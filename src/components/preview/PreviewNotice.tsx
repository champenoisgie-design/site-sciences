"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOTAL_SECONDS = 180; // 3 minutes

export default function PreviewNotice() {
  const router = useRouter();
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = window.setTimeout(() => {
      router.push("/tarifs");
    }, TOTAL_SECONDS * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [router]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const label =
    minutes > 0
      ? `${minutes} min ${seconds.toString().padStart(2, "0")} s`
      : `${seconds} s`;

  return (
    <div className="rounded-xl border border-amber-400/70 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 shadow-sm">
      <p className="font-semibold">Mode démonstration</p>
      <p className="mt-1">
        Tu vois ici une version limitée du site avec un thème visuel actif.
        Certaines fonctionnalités sont désactivées. Tu seras automatiquement
        redirigé vers les tarifs dans{" "}
        <span className="font-semibold">{label}</span>.
      </p>
    </div>
  );
}
