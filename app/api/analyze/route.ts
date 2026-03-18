import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { anonymiseText } from '@/lib/anonymise'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Te egy tapasztalt, empatikus orvosi AI asszisztens vagy, aki a magyar egészségügyi rendszerben segít pácienseknek megérteni tüneteiket és leleteiket.

A feladatod: egy strukturált, JSON formátumú második véleményt adni a megadott adatok alapján.

FONTOS SZABÁLYOK:
1. Soha nem diagnosztizálsz – csak elemzel és kérdéseket javasolsz
2. Mindig hangsúlyozod, hogy ez nem helyettesíti az orvosi vizsgálatot
3. Empatikusan, de szakszerűen kommunikálsz
4. Magyar nyelven válaszolsz
5. CSAK valid JSON-t adsz vissza, semmit más

Válasz formátum (CSAK EZT ADD VISSZA, semmi más szöveg):
{
  "summary": "2-3 mondatos összefoglaló magyarul",
  "findings": ["találat 1", "találat 2", "..."],
  "recommendation": "urgent|soon|monitor|relax",
  "recommendation_text": "részletes ajánlás szövege",
  "questions_to_ask": ["Kérdés az orvosnak 1", "Kérdés 2", "..."],
  "red_flags": ["vészjel 1 ha van, különben üres tömb"],
  "google_search_query": "rövid angol keresési kifejezés a témához",
  "disclaimer": "Fontos: Ez az elemzés nem orvosi diagnózis..."
}

recommendation értékek:
- "urgent": sürgős orvosi vizsgálat szükséges (24 órán belül)
- "soon": mielőbbi orvosi konzultáció javasolt (1-2 héten belül)  
- "monitor": figyelj a tünetekre, tájékozódj (nem sürgős)
- "relax": a leírtak valószínűleg nem komolyak, de konzultálhatsz orvossal`

function buildUserPrompt(story: string, age: string, gender: string, city: string): string {
  const parts: string[] = []

  if (age) parts.push(`Életkor: ${age} év`)
  if (gender) parts.push(`Nem: ${gender}`)
  if (city) parts.push(`Helyszín: ${city}`)

  parts.push('')
  parts.push('A páciens leírása saját szavával:')
  parts.push(story || '(Nem adott meg szöveges leírást – csak feltöltött dokumentumok alapján elemezz.)')

  return parts.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const story = (formData.get('story') as string) || ''
    const age = (formData.get('age') as string) || ''
    const gender = (formData.get('gender') as string) || ''
    const city = (formData.get('city') as string) || ''
    const files = formData.getAll('files') as File[]

    // Validate minimum input
    if (!story.trim() && files.length === 0) {
      return NextResponse.json(
        { error: 'Kérlek adj meg tünetleírást vagy tölts fel dokumentumot.' },
        { status: 400 }
      )
    }

    // Build Claude message content using SDK types directly
    type AllowedMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    type ContentBlock =
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: AllowedMediaType; data: string } }

    const content: ContentBlock[] = []

    // Process uploaded files
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())

      if (file.type === 'application/pdf') {
        // Dynamically import pdf-parse (it has side-effects on import)
        const pdfParse = (await import('pdf-parse')).default
        try {
          const data = await pdfParse(buffer)
          const cleanText = anonymiseText(data.text)
          content.push({
            type: 'text',
            text: `\n\n--- Feltöltött PDF tartalom (${file.name}) ---\n${cleanText}\n---`,
          })
        } catch {
          content.push({
            type: 'text',
            text: `\n\n[PDF feldolgozási hiba: ${file.name} – tartalom nem olvasható]`,
          })
        }
      } else if (file.type.startsWith('image/')) {
        // Send image directly to Claude vision
        const base64 = buffer.toString('base64')
        const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        })
      }
    }

    // Add the text prompt last
    content.push({
      type: 'text',
      text: buildUserPrompt(story, age, gender, city),
    })

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user' as const, content: content as any }],
    })

    const rawText =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Strip any markdown fences Claude might add
    const jsonText = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let result
    try {
      result = JSON.parse(jsonText)
    } catch {
      // If parsing fails, return a graceful error object
      result = {
        summary: 'Az elemzés során technikai hiba lépett fel.',
        findings: [],
        recommendation: 'monitor',
        recommendation_text: 'Kérlek próbáld újra, vagy fordulj közvetlenül orvoshoz.',
        questions_to_ask: [],
        red_flags: [],
        google_search_query: '',
        disclaimer:
          'Ez az elemzés nem helyettesíti a szakorvosi vizsgálatot.',
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json(
      { error: 'Szerver hiba. Kérlek próbáld újra.' },
      { status: 500 }
    )
  }
}

// Set max request body size for file uploads (Next.js App Router way)
export const maxDuration = 60
