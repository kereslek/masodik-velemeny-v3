import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Lazy initializer — only creates the client when first called at runtime
// (not at build time, avoiding the "supabaseUrl is required" error)
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase env vars not set')
    _client = createClient(url, key, { auth: { persistSession: false } })
  }
  return _client
}
