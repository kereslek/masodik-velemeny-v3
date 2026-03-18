/**
 * Rate limiting — 10 analyses per IP per calendar day.
 * Stored in Supabase `rate_limits` table.
 * Falls back gracefully if Supabase is not configured (dev mode: always allow).
 */

export const DAILY_LIMIT = 10

export interface RateLimitResult {
  allowed: boolean
  used: number
  limit: number
  resetAt: string
}

function todayUTC(): string {
  return new Date().toISOString().split('T')[0]
}

function tomorrowMidnightUTC(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + 1)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function checkAndIncrement(ip: string): Promise<RateLimitResult> {
  const today = todayUTC()
  const resetAt = tomorrowMidnightUTC()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[RateLimit] Supabase not configured — skipping rate limit')
    return { allowed: true, used: 0, limit: DAILY_LIMIT, resetAt }
  }

  try {
    const { getSupabase } = await import('./supabase')
    const db = getSupabase()

    // Fetch current count for this IP today
    const { data: existing } = await db
      .from('rate_limits')
      .select('count')
      .eq('ip', ip)
      .eq('date', today)
      .maybeSingle()

    const currentCount = existing?.count ?? 0

    if (currentCount >= DAILY_LIMIT) {
      return { allowed: false, used: currentCount, limit: DAILY_LIMIT, resetAt }
    }

    const newCount = currentCount + 1

    if (currentCount === 0) {
      // First request today — insert
      await db.from('rate_limits').insert({ ip, date: today, count: 1 })
    } else {
      // Increment
      await db.from('rate_limits').update({ count: newCount }).eq('ip', ip).eq('date', today)
    }

    return { allowed: true, used: newCount, limit: DAILY_LIMIT, resetAt }
  } catch (err) {
    console.error('[RateLimit] Error — failing open:', err)
    return { allowed: true, used: 0, limit: DAILY_LIMIT, resetAt }
  }
}
