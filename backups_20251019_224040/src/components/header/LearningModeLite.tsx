"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const MODES = [
  { value: "", label: "Aucun (défaut)" },
  { value: "tdah", label: "TDAH" },
  { value: "dys", label: "DYS" },
  { value: "tsa", label: "TSA" },
  { value: "hpi", label: "HPI" },
  { value: "parents", label: "Parents (beta)" },
];

export default function LearningModeLite() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Optionnel: lire un state existant (localStorage)
    const saved = localStorage.getItem("learningMode.selected") ?? "";
    setValue(saved);
  }, []);

  const onChange = (v: string) => {
    setValue(v);
    localStorage.setItem("learningMode.selected", v);
    if (!v) {
      if (pathname !== "/") router.push("/");
    } else {
      router.push(`/modes/${v}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Modes complémentaires</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {MODES.map((m) => (
          <option key={m.value || "none"} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
