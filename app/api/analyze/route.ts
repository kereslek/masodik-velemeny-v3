import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { anonymiseText } from '@/lib/anonymise'
import { checkAndIncrement, DAILY_LIMIT } from '@/lib/rateLimit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

const buildSystemPrompt = (hasFiles: boolean) => `Te egy tapasztalt, empatikus orvosi AI asszisztens vagy, aki a magyar egészségügyi rendszerben segít pácienseknek megérteni tüneteiket, leleteiket, vérvizsgálati eredményeiket és diagnózisaikat.

Különösen értesz a következőkhöz: vérkép elemzés, laboreredmény értelmezés, vérvétel eredmények magyarázata, hemoglobin, fehérvérsejt, vércukorszint, koleszterin, pajzsmirigy, vesefunkció, máj enzimek (ALT, AST), CRP gyulladásos marker, eGFR értékek magyarázata.

FONTOS SZABÁLYOK:
1. Soha nem diagnosztizálsz – csak elemzel, magyarázol és kérdéseket javasolsz
2. Az "összefüggések" szekció nem diagnózis – csak lehetséges irányok, amiket szakorvosnak kell kizárnia
3. Empatikusan, de szakszerűen kommunikálsz
4. Magyar nyelven válaszolsz
5. CSAK valid JSON-t adsz vissza, semmi más szöveg

Válasz formátum (KIZÁRÓLAG ezt a JSON-t add vissza, semmi más):
{
  "summary": "2-3 mondatos összefoglaló",
  "findings": ["megfigyelés 1", "megfigyelés 2"],
  "recommendation": "urgent|soon|monitor|relax",
  "recommendation_text": "részletes ajánlás",
  "differential_considerations": [
    {
      "condition": "Állapot neve magyarul",
      "reason": "Miért releváns ez a tünetek/lelet alapján – 1-2 mondat",
      "how_to_exclude": "Milyen vizsgálattal zárható ki – pl. vérkép, EKG, ultrahang"
    }
  ],
  "questions_to_ask": ["Kérdés az orvosnak 1", "Kérdés 2"],
  "red_flags": ["vészjel ha van – különben üres tömb []"],
  "coherence_score": ${hasFiles ? 'szám 0-tól 100-ig' : 'null'},
  "coherence_summary": ${hasFiles ? '"1 mondatos magyarázat"' : 'null'},
  "clinic_search_query": "magyar nyelvű keresés szakorvos/klinika Magyarországon",
  "google_search_query": "magyar nyelvű keresés az állapotról általános tájékozódáshoz",
  "disclaimer": "Ez az elemzés tájékoztató jellegű és nem helyettesíti a szakorvosi vizsgálatot."
}

differential_considerations szabályok:
- 2-4 lehetséges összefüggés, SOHA nem több
- Csak olyat írj, ami ténylegesen releváns a leírt tünetek/lelet alapján
- Fogalmazz óvatosan: "érdemes kizárni" hangnemben, nem diagnózisként
- Ha a tünetek egyértelműen enyhék (relax kategória), ne adj meg komolyabb állapotokat
- Ha nincs elegendő adat, adj meg kevesebbet (akár csak 1-2 elemet)

recommendation: urgent (24h) | soon (1-2 hét) | monitor (figyelj) | relax (nem komoly)`

function buildUserPrompt(story: string, age: string, gender: string, city: string): string {
  const parts: string[] = []
  if (age) parts.push(`Életkor: ${age} év`)
  if (gender) parts.push(`Nem: ${gender}`)
  if (city) parts.push(`Helyszín: ${city}`)
  parts.push('')
  parts.push('A páciens leírása:')
  parts.push(story || '(Csak feltöltött dokumentumok alapján elemezz.)')
  return parts.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req)
    const rateLimit = await checkAndIncrement(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', queries_used: rateLimit.used, queries_limit: rateLimit.limit, reset_at: rateLimit.resetAt },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const story  = (formData.get('story')  as string) || ''
    const age    = (formData.get('age')    as string) || ''
    const gender = (formData.get('gender') as string) || ''
    const city   = (formData.get('city')   as string) || ''
    const files  = formData.getAll('files') as File[]

    if (!story.trim() && files.length === 0) {
      return NextResponse.json({ error: 'Kérlek adj meg tünetleírást vagy tölts fel dokumentumot.' }, { status: 400 })
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
          content.push({ type: 'text', text: `\n\n--- Feltöltött PDF (${file.name}) ---\n${anonymiseText(data.text)}\n---` })
        } catch {
          content.push({ type: 'text', text: `\n\n[PDF feldolgozási hiba: ${file.name}]` })
        }
      } else if (file.type.startsWith('image/')) {
        const base64 = buffer.toString('base64')
        let mt: AllowedMediaType = 'image/jpeg'
        if (file.type === 'image/png') mt = 'image/png'
        else if (file.type === 'image/gif') mt = 'image/gif'
        else if (file.type === 'image/webp') mt = 'image/webp'
        content.push({ type: 'image', source: { type: 'base64', media_type: mt, data: base64 } })
        content.push({ type: 'text', text: `[Feltöltött kép: ${file.name}]` })
      }
    }

    content.push({ type: 'text', text: buildUserPrompt(story, age, gender, city) })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2800,
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
        differential_considerations: [],
        questions_to_ask: [],
        red_flags: [],
        coherence_score: null,
        coherence_summary: null,
        clinic_search_query: 'háziorvos rendelés Magyarország',
        google_search_query: 'tünetek orvosi tanács',
        disclaimer: 'Ez az elemzés nem helyettesíti a szakorvosi vizsgálatot.',
      }
    }

    if (!hasFiles) { result.coherence_score = null; result.coherence_summary = null }
    if (!result.differential_considerations) result.differential_considerations = []

    return NextResponse.json(result)
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json({ error: 'Szerver hiba. Kérlek próbáld újra.' }, { status: 500 })
  }
}

export const maxDuration = 60
