"use client"
import { useEffect, useState } from "react"

type LearningMode = "Normal" | "TDAH" | "DYS"
const KEY = "__learning_mode__"

export default function ModeLearningSwitcher() {
  const [mode, setMode] = useState<LearningMode>("Normal")

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as LearningMode) || "Normal"
    setMode(saved)
    document.documentElement.setAttribute("data-learning", saved)
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, mode)
    document.documentElement.setAttribute("data-learning", mode)
  }, [mode])

  return (
    <label className="flex items-center gap-2 text-sm">
      <span>Mode d’apprentissage</span>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as LearningMode)}
        className="rounded border bg-transparent px-2 py-1"
        aria-label="Choisir le mode d’apprentissage"
      >
        <option value="Normal">Normal</option>
        <option value="TDAH">TDAH</option>
        <option value="DYS">DYS</option>
      </select>
    </label>
  )
}
