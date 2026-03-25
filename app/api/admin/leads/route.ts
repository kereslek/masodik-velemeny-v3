import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Simple key auth — only callable server-side or from admin page
  const key = req.headers.get('x-admin-key')
  if (key !== 'diagnozisom-admin-2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/leads?select=*&order=created_at.desc&limit=500`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[Admin leads] Supabase error:', err)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[Admin leads] Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
