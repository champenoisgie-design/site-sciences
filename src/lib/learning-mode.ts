// PATCH_TAG_MODES_CLASSIQUE_PANIER_V3
export type LearningMode = 'normal' | 'tdah' | 'dys' | 'tsa' | 'hpi'

export const LEARNING_MODES: { value: LearningMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'tdah', label: 'TDAH' },
  { value: 'dyslexie', label: 'Dyslexie' },
  { value: 'dyscalculie', label: 'Dyscalculie' },
  { value: 'dyspraxie', label: 'Dyspraxie' },
  { value: 'dysgraphie', label: 'Dysgraphie' },

  { value: 'tsa', label: 'TSA' },
  { value: 'hpi', label: 'HPI' },
]

export const LEARNING_MODE_COOKIE = 'learningMode'

/** Mode par défaut si le cookie n'existe pas */
export const DEFAULT_LEARNING_MODE: LearningMode = 'normal'
