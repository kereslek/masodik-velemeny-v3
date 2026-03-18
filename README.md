# MásodikVélemény v2

Hungarian AI-powered medical second opinion platform. Clean rebuild using Next.js 14 App Router.

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom design system
- **Animations:** Framer Motion
- **AI:** Anthropic Claude Sonnet (`claude-sonnet-4-20250514`)
- **File processing:** react-dropzone + pdf-parse (server-side)
- **Deployment:** Vercel

## Features

- ✅ Instant intake form on homepage (no sub-navigation needed)
- ✅ Age, gender, city fields
- ✅ Symptom text + voice dictation (Hungarian, Web Speech API)
- ✅ PDF + image upload with drag & drop (up to 10MB each)
- ✅ Claude vision for medical image analysis
- ✅ PDF text extraction + GDPR anonymisation
- ✅ Structured AI response (recommendation, findings, questions, red flags)
- ✅ Results page with confetti for positive outcomes
- ✅ Google search integration
- ✅ Print/PDF export
- ✅ Zero data storage – GDPR compliant by design
- ✅ Mobile responsive

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.local.example .env.local
# → Add your ANTHROPIC_API_KEY

# 3. Dev server
npm run dev
# → http://localhost:3000

# 4. Deploy
vercel deploy --prod
```

## File Structure

```
masodik-velemeny-v2/
├── app/
│   ├── globals.css          Design system (fonts, colors, components)
│   ├── layout.tsx           Root layout (nav + footer + disclaimer)
│   ├── page.tsx             Home page = hero + intake form
│   ├── eredmeny/page.tsx    Results page
│   ├── partnerek/page.tsx   Partners page
│   ├── adatvedelem/page.tsx Privacy page
│   └── api/analyze/         POST endpoint → Claude API
├── components/
│   ├── Disclaimer.tsx       Dismissable amber banner
│   ├── NavBar.tsx           Sticky glass navigation
│   ├── Footer.tsx
│   ├── IntakeForm.tsx       Form: age/gender/city/story/files/voice
│   └── ResultsDisplay.tsx  Full results UI
├── hooks/
│   └── useSpeech.ts        Web Speech API (Hungarian)
└── lib/
    ├── anonymise.ts        GDPR – strips PII from documents
    ├── types.ts            Shared TypeScript types
    └── utils.ts            cn() + formatFileSize()
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | From console.anthropic.com |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | Future: lead storage |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | Future: lead storage |
| `RESEND_API_KEY` | ❌ | Future: email results |

## Vercel Deployment

1. Push to GitHub
2. Import repo on vercel.com
3. Add `ANTHROPIC_API_KEY` in Environment Variables
4. Deploy → live in ~2 minutes

---

**Disclaimer:** This application provides AI-generated information only and does not constitute medical advice. Always consult a qualified healthcare professional.
