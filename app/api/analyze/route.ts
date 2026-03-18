import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { anonymiseText } from '@/lib/anonymise'
import { checkAndIncrement, DAILY_LIMIT } from '@/lib/rateLimit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Helpers ───────────────────────────────────────────────────────────────────

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

const buildSystemPrompt = (hasFiles: boolean) => `Te egy tapasztalt, empatikus orvosi AI asszisztens vagy, aki a magyar egészségügyi rendszerben segít pácienseknek megérteni tüneteiket, leleteiket és diagnózisaikat.

A feladatod: strukturált, JSON formátumú elemzést adni. Segítesz megérteni a helyzetet, értelmezed az orvosi dokumentumokat, és ha kell, második véleményt adsz.

FONTOS SZABÁLYOK:
1. Soha nem diagnosztizálsz – csak elemzel, magyarázol és kérdéseket javasolsz
2. Mindig hangsúlyozod, hogy ez nem helyettesíti az orvosi vizsgálatot
3. Empatikusan, de szakszerűen kommunikálsz
4. Magyar nyelven válaszolsz
5. CSAK valid JSON-t adsz vissza, semmit más – sem előtte, sem utána

Válasz formátum (KIZÁRÓLAG ezt a JSON-t add vissza, semmi más szöveg):
{
  "summary": "2-3 mondatos összefoglaló magyarul – mi a helyzet és mi a legfontosabb üzenet",
  "findings": ["megfigyelés 1", "megfigyelés 2", "..."],
  "recommendation": "urgent|soon|monitor|relax",
  "recommendation_text": "részletes, személyes hangú ajánlás – mit tegyen most a páciens",
  "questions_to_ask": ["Konkrét kérdés az orvosnak 1", "Kérdés 2", "..."],
  "red_flags": ["vészjel ha van – különben üres tömb []"],
  "coherence_score": ${hasFiles ? 'szám 0-tól 100-ig (mennyire egyezik a szöveges leírás és a feltöltött dokumentum tartalma – 100 = teljesen egyezik, 0 = ellentmond egymásnak)' : 'null'},
  "coherence_summary": ${hasFiles ? '"1 mondatos magyarázat az egyezésről"' : 'null'},
  "clinic_search_query": "magyar nyelvű Google keresési kifejezés konkrét szakorvos vagy klinika kereséséhez Magyarországon",
  "google_search_query": "magyar nyelvű keresési kifejezés az adott állapotról általános orvosi tájékozódáshoz",
  "disclaimer": "Ez az elemzés tájékoztató jellegű és nem helyettesíti a szakorvosi vizsgálatot vagy diagnózist."
}

recommendation értékek: urgent (24 órán belül) | soon (1-2 héten belül) | monitor (figyeld) | relax (nem komoly)
clinic_search_query és google_search_query MINDIG magyar nyelvű legyen.`

function buildUserPrompt(story: string, age: string, gender: string, city: string): string {
  const parts: string[] = []
  if (age) parts.push(`Életkor: ${age} év`)
  if (gender) parts.push(`Nem: ${gender}`)
  if (city) parts.push(`Helyszín: ${city}`)
  parts.push('')
  parts.push('A páciens leírása saját szavaival:')
  parts.push(story || '(Nem adott meg szöveges leírást – csak a feltöltött dokumentumok alapján elemezz.)')
  return parts.join('\n')
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ──
    const ip = getClientIP(req)
    const rateLimit = await checkAndIncrement(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          queries_used: rateLimit.used,
          queries_limit: rateLimit.limit,
          reset_at: rateLimit.resetAt,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt,
            'Retry-After': String(Math.ceil((new Date(rateLimit.resetAt).getTime() - Date.now()) / 1000)),
          },
        }
      )
    }

    // ── Parse form data ──
    const formData = await req.formData()
    const story  = (formData.get('story')  as string) || ''
    const age    = (formData.get('age')    as string) || ''
    const gender = (formData.get('gender') as string) || ''
    const city   = (formData.get('city')   as string) || ''
    const files  = formData.getAll('files') as File[]

    if (!story.trim() && files.length === 0) {
      return NextResponse.json(
        { error: 'Kérlek adj meg tünetleírást vagy tölts fel dokumentumot.' },
        { status: 400 }
      )
    }

    const hasFiles = files.length > 0

    type AllowedMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    type ContentBlock =
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: AllowedMediaType; data: string } }

    const content: ContentBlock[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      if (file.type === 'application/pdf') {
        const pdfParse = (await import('pdf-parse')).default
        try {
          const data = await pdfParse(buffer)
          const cleanText = anonymiseText(data.text)
          content.push({ type: 'text', text: `\n\n--- Feltöltött PDF (${file.name}) ---\n${cleanText}\n---` })
        } catch {
          content.push({ type: 'text', text: `\n\n[PDF feldolgozási hiba: ${file.name}]` })
        }
      } else if (file.type.startsWith('image/')) {
        const base64 = buffer.toString('base64')
        let mediaType: AllowedMediaType = 'image/jpeg'
        if (file.type === 'image/png') mediaType = 'image/png'
        else if (file.type === 'image/gif') mediaType = 'image/gif'
        else if (file.type === 'image/webp') mediaType = 'image/webp'
        content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } })
        content.push({ type: 'text', text: `[Feltöltött kép: ${file.name}]` })
      }
    }

    content.push({ type: 'text', text: buildUserPrompt(story, age, gender, city) })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: buildSystemPrompt(hasFiles),
      messages: [{ role: 'user' as const, content: content as any }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    let result
    try {
      result = JSON.parse(jsonText)
    } catch {
      result = {
        summary: 'Az elemzés során technikai hiba lépett fel.',
        findings: [],
        recommendation: 'monitor',
        recommendation_text: 'Kérlek próbáld újra.',
        questions_to_ask: [],
        red_flags: [],
        coherence_score: null,
        coherence_summary: null,
        clinic_search_query: 'háziorvos rendelés Magyarország',
        google_search_query: 'tünetek orvosi tanács',
        disclaimer: 'Ez az elemzés nem helyettesíti a szakorvosi vizsgálatot.',
      }
    }

    if (!hasFiles) {
      result.coherence_score = null
      result.coherence_summary = null
    }

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(Math.max(0, rateLimit.limit - rateLimit.used)),
        'X-RateLimit-Reset': rateLimit.resetAt,
      },
    })
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json({ error: 'Szerver hiba. Kérlek próbáld újra.' }, { status: 500 })
  }
}

export const maxDuration = 60
