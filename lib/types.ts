export type Recommendation = 'urgent' | 'soon' | 'monitor' | 'relax'

export interface AnalysisResult {
  summary: string
  findings: string[]
  recommendation: Recommendation
  recommendation_text: string
  questions_to_ask: string[]
  red_flags: string[]
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
