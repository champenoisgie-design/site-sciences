// PATCH_TAG_MODES_CLASSIQUE_PANIER_V3
'use client'
import { useEffect, useState } from 'react'

type LearningMode = 'Classique' | 'TDAH' | 'DYS'
const KEY = '__learning_mode__'

export default function ModeLearningSwitcher() {
  const [mode, setMode] = useState<LearningMode>('Classique')

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as LearningMode) || 'Classique'
    setMode(saved)
    document.documentElement.setAttribute('data-learning', saved)
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, mode)
    document.documentElement.setAttribute('data-learning', mode)
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
        <option value="Classique">Classique</option>
        <option value="TDAH">TDAH</option>
        <option value="Dyslexie">Dyslexie</option>
        <option value="Dyscalculie">Dyscalculie</option>
        <option value="Dyspraxie">Dyspraxie</option>
        <option value="Dysgraphie">Dysgraphie</option>
        <option value="TSA">TSA</option>
        <option value="HPI">HPI</option>

      </select>
    </label>
  )
}
