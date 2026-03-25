export type Recommendation = 'urgent' | 'soon' | 'monitor' | 'relax'

export interface DifferentialItem {
  condition: string       // Name of the condition in Hungarian
  reason: string          // Why it's relevant based on the symptoms/findings
  how_to_exclude: string  // What test/exam would rule it out
}

export interface AnalysisResult {
  summary: string
  findings: string[]
  recommendation: Recommendation
  recommendation_text: string
  // NEW: differential considerations — shown BEFORE questions_to_ask
  differential_considerations: DifferentialItem[]
  questions_to_ask: string[]
  red_flags: string[]
  coherence_score: number | null
  coherence_summary: string | null
  clinic_search_query: string
  google_search_query: string
  disclaimer: string
}

export interface FormState {
  age: string
  gender: string
  city: string
  story: string
  files: File[]
}
