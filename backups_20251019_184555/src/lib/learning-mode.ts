export type LearningMode = 'normal' | 'tdah' | 'dys' | 'tsa' | 'hpi'

export const LEARNING_MODES: { value: LearningMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'tdah', label: 'TDAH' },
  { value: 'dys', label: 'DYS' },
  { value: 'tsa', label: 'TSA' },
  { value: 'hpi', label: 'HPI' },
]

export const LEARNING_MODE_COOKIE = 'learningMode'

/** Mode par défaut si le cookie n'existe pas */
export const DEFAULT_LEARNING_MODE: LearningMode = 'normal'
