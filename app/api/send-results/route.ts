import { NextRequest, NextResponse } from 'next/server'
import type { AnalysisResult } from '@/lib/types'

const RECOMMENDATION_LABELS: Record<string, string> = {
  urgent:  '🔴 Sürgős orvosi vizsgálat',
  soon:    '🟡 Mielőbbi konzultáció javasolt',
  monitor: '🔵 Figyelj és tájékozódj',
  relax:   '🟢 Valószínűleg nem komoly',
}

function buildResultsEmail(result: AnalysisResult, wantsContact: boolean, wantsNewsletter: boolean): string {
  const recLabel = RECOMMENDATION_LABELS[result.recommendation] || result.recommendation

  const optInsHtml = (wantsContact || wantsNewsletter) ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:20px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#166534">Beállított preferenciák:</p>
      ${wantsContact ? '<p style="margin:0 0 4px;font-size:13px;color:#15803d">✅ Orvosi visszahívást kért — partnerünk felveszi Önnel a kapcsolatot.</p>' : ''}
      ${wantsNewsletter ? '<p style="margin:0;font-size:13px;color:#15803d">✅ Feliratkozott a hírlevélre — egészségügyi tippeket és cikkeket küldünk.</p>' : ''}
    </div>` : ''

  const differentialHtml = result.differential_considerations?.length > 0
    ? `<div style="margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 12px">Az AI által azonosított lehetséges összefüggések</h3>
        ${result.differential_considerations.map((d, i) => `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:8px">
            <p style="font-size:13px;font-weight:600;color:#0f172a;margin:0 0 4px">${i + 1}. ${d.condition}</p>
            <p style="font-size:13px;color:#475569;margin:0 0 6px;line-height:1.5">${d.reason}</p>
            <p style="font-size:12px;color:#0ea5e9;margin:0">Kizárható: ${d.how_to_exclude}</p>
          </div>`).join('')}
      </div>` : ''

  const questionsHtml = result.questions_to_ask?.length > 0
    ? `<div style="margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 12px">Kérdések az orvosnak</h3>
        ${result.questions_to_ask.map((q, i) => `
          <div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
            <span style="min-width:22px;height:22px;background:#0ea5e9;color:white;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">${i + 1}</span>
            <p style="font-size:13px;color:#475569;margin:0;line-height:1.5">${q}</p>
          </div>`).join('')}
      </div>` : ''

  return `<!DOCTYPE html>
<html lang="hu"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">
    <div style="padding:28px 32px 20px;border-bottom:1px solid #f1f5f9">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:40px;height:40px;background:#f0fdf4;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px">❤️</div>
        <div>
          <p style="margin:0;font-weight:700;font-size:16px;color:#0f172a">Diagnózisom.hu</p>
          <p style="margin:0;font-size:12px;color:#64748b">AI orvosi második vélemény</p>
        </div>
      </div>
    </div>
    <div style="padding:24px 32px">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:20px">
        <p style="margin:0;font-size:14px;font-weight:600;color:#166534">${recLabel}</p>
        ${result.recommendation_text ? `<p style="margin:8px 0 0;font-size:13px;color:#15803d;line-height:1.5">${result.recommendation_text}</p>` : ''}
      </div>
      ${optInsHtml}
      <div style="margin-bottom:20px">
        <h3 style="font-size:15px;font-weight:600;color:#0f172a;margin:0 0 8px">Összefoglaló</h3>
        <p style="font-size:13px;color:#475569;line-height:1.65;margin:0">${result.summary}</p>
      </div>
      ${differentialHtml}
      ${questionsHtml}
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-top:20px">
        <p style="margin:0;font-size:12px;color:#9a3412;line-height:1.5"><strong>Fontos:</strong> ${result.disclaimer}</p>
      </div>
      <div style="margin-top:20px;text-align:center">
        <a href="https://diagnozisom.hu" style="display:inline-block;background:#0ea5e9;color:white;padding:10px 24px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none">Új elemzés indítása</a>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center">
      <p style="margin:0;font-size:11px;color:#94a3b8">© ${new Date().getFullYear()} Diagnózisom.hu · <a href="https://diagnozisom.hu/adatvedelem" style="color:#94a3b8">Adatvédelem</a></p>
    </div>
  </div>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, result, wants_contact, wants_newsletter, name, phone } = body as {
      email: string
      result: AnalysisResult
      wants_contact: boolean
      wants_newsletter: boolean
      name?: string
      phone?: string
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Érvényes email cím szükséges.' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'Email küldés nem elérhető.' }, { status: 503 })
    }

    const fromAddress = process.env.EMAIL_FROM || 'Diagnózisom <onboarding@resend.dev>'
    const toAddress = process.env.EMAIL_TO_OVERRIDE || email

    // Send results email
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        subject: 'Az AI elemzésed eredménye – Diagnózisom.hu',
        html: buildResultsEmail(result, wants_contact, wants_newsletter),
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.json()
      console.error('[SendResults] Resend error:', err)
      return NextResponse.json({ error: 'Email küldési hiba.' }, { status: 500 })
    }

    // Save lead if either opt-in is checked
    if (wants_contact || wants_newsletter) {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (url && key) {
          const insertRes = await fetch(`${url}/rest/v1/leads`, {
            method: 'POST',
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({
              name: name || null,
              email,
              phone: phone || null,
              professional_followup: wants_contact,
              newsletter: wants_newsletter,
            }),
          })
          if (!insertRes.ok) {
            const errText = await insertRes.text()
            console.error('[SendResults] Supabase insert error:', insertRes.status, errText)
          } else {
            console.log('[SendResults] Lead saved to Supabase ✓')
          }
        }
      } catch (e) {
        console.error('[SendResults] Supabase exception:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SendResults] Error:', err)
    return NextResponse.json({ error: 'Szerver hiba.' }, { status: 500 })
  }
}
