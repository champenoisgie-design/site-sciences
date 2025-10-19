"use client";
import React from "react";

const OPTIONS = [
  { value: "off",  label: "Aucun (défaut)" },
  { value: "tdah", label: "TDAH" },
  { value: "dys",  label: "DYS"  },
  { value: "tsa",  label: "TSA"  },
  { value: "hpi",  label: "HPI"  },
];

export default function LearningModeLite() {
  const [value, setValue] = React.useState<string>(() => {
    if (typeof window === "undefined") return "off";
    return localStorage.getItem("learning-mode") || "off";
  });

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setValue(v);
    try {
      localStorage.setItem("learning-mode", v);
      window.dispatchEvent(new Event("learning-mode:change"));
      setTimeout(() => location.reload(), 50);
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-80 whitespace-nowrap">Modes complémentaires</span>
      <select
        value={value}
        onChange={onChange}
        className="rounded-lg border px-2 py-1 text-sm bg-white/70 backdrop-blur-sm"
        aria-label="Choisir un mode complémentaire"
      >
        {OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
