import { NextRequest, NextResponse } from 'next/server'

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sendConfirmationEmail(email: string, name: string, followup: boolean) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('[Email] RESEND_API_KEY not set — skipping confirmation email')
    return
  }

  const firstName = name ? name.split(' ')[0] : 'kedves felhasználó'

  const htmlBody = `
<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">
    
    <div style="padding:32px 32px 24px;border-bottom:1px solid #f1f5f9;text-align:center">
      <div style="width:52px;height:52px;background:#f0fdf4;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;font-size:26px">❤️</div>
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-0.02em">Diagnózisom</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#64748b">AI orvosi második vélemény platform</p>
    </div>

    <div style="padding:28px 32px">
      <p style="margin:0 0 16px;font-size:15px;color:#1e293b">Kedves <strong>${firstName}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.65">
        Az adataidat sikeresen rögzítettük. Köszönjük, hogy a <strong>Diagnózisom</strong> platformot használtad egészségügyi kérdéseidhez.
      </p>

      ${followup ? `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#15803d">✓ Visszajelzés igényelve</p>
        <p style="margin:0;font-size:13px;color:#166534;line-height:1.5">
          Rögzítettük, hogy szeretnél orvosi visszajelzést kapni. Egy regisztrált orvosi partnerünk hamarosan felkeresi az általad megadott elérhetőségen.
        </p>
      </div>
      ` : ''}

      <div style="background:#fafafa;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em">Adatvédelem</p>
        <p style="margin:0;font-size:13px;color:#475569;line-height:1.6">
          Az egészségügyi adataidat <strong>nem tároljuk</strong> — azok az elemzés után törlésre kerültek. 
          Kizárólag a megadott kapcsolati adataidat (${followup ? 'visszajelzés céljából' : 'igény szerint'}) kezeljük, GDPR szerint.
        </p>
      </div>

      <p style="margin:0 0 8px;font-size:13px;color:#475569">
        Ha bármilyen kérdésed van, írj nekünk:
      </p>
      <a href="mailto:info@diagnozisom.hu" style="color:#0ea5e9;font-size:13px;text-decoration:none">info@diagnozisom.hu</a>
    </div>

    <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center">
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8">
        <a href="https://diagnozisom.hu" style="color:#0ea5e9;text-decoration:none">diagnozisom.hu</a>
        &nbsp;·&nbsp;
        <a href="https://diagnozisom.hu/adatvedelem" style="color:#94a3b8;text-decoration:none">Adatvédelem</a>
      </p>
      <p style="margin:0;font-size:11px;color:#cbd5e1">
        Ez az üzenet automatikusan jött létre. Kérlek ne válaszolj rá.
      </p>
    </div>

  </div>
</body>
</html>
`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Diagnózisom <info@diagnozisom.hu>',
      to: [email],
      subject: followup
        ? 'Adatait rögzítettük – orvosi visszajelzés folyamatban'
        : 'Köszönjük – adatait rögzítettük',
      html: htmlBody,
    }),
  })
}

async function saveLeadToSupabase(lead: {
  name: string; email: string; phone: string; professional_followup: boolean
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn('[Lead] Supabase not configured — lead not persisted')
    return
  }

  await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      name: lead.name || null,
      email: lead.email,
      phone: lead.phone || null,
      professional_followup: lead.professional_followup,
    }),
  })
}

// ── Route handlers ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name = '', email = '', phone = '', professional_followup = false } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Érvényes email cím szükséges.' }, { status: 400 })
    }

    // Save to Supabase and send email in parallel
    await Promise.allSettled([
      saveLeadToSupabase({ name, email, phone, professional_followup }),
      sendConfirmationEmail(email, name, professional_followup),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Lead] Error:', err)
    return NextResponse.json({ error: 'Szerver hiba.' }, { status: 500 })
  }
}
