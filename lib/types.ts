export type Recommendation = 'urgent' | 'soon' | 'monitor' | 'relax'

export interface AnalysisResult {
  summary: string
  findings: string[]
  recommendation: Recommendation
  recommendation_text: string
  questions_to_ask: string[]
  red_flags: string[]
  // Coherence between text description and uploaded documents (only present if files were uploaded)
  coherence_score: number | null        // 0–100, null if no files uploaded
  coherence_summary: string | null      // 1 sentence explaining alignment
  // Search queries
  clinic_search_query: string           // Hungarian Google query for finding a doctor/clinic
  google_search_query: string           // General info search query (English)
  disclaimer: string
}

export interface FormState {
  age: string
  gender: string
  city: string
  story: string
  files: File[]
}
