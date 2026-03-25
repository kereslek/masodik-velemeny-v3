import { NextRequest, NextResponse } from 'next/server'

/**
 * Keep-alive endpoint — called by Vercel Cron every 3 days.
 * Prevents Supabase free tier from pausing due to inactivity.
 * Also acts as a health check for the full stack.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, string> = {}

  // Ping Supabase with a lightweight query
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (url && key) {
      const res = await fetch(`${url}/rest/v1/rate_limits?select=count&limit=1`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      })
      results.supabase = res.ok ? 'ok' : `error ${res.status}`
    } else {
      results.supabase = 'not configured'
    }
  } catch (e) {
    results.supabase = `exception: ${e}`
  }

  results.timestamp = new Date().toISOString()

  return NextResponse.json({ status: 'alive', ...results })
}
