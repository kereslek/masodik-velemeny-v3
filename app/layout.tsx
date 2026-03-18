import type { Metadata } from 'next'
import './globals.css'
import { Disclaimer } from '@/components/Disclaimer'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://masodikvelemeny.hu'
const SITE_NAME = 'MásodikVélemény'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MásodikVélemény – Értsd meg a diagnózisodat. AI orvosi segítség azonnal.',
    template: '%s | MásodikVélemény',
  },
  description:
    'Nem érted a diagnózisodat vagy a leleted? Kétséged van az orvosi véleménnyel kapcsolatban? Töltsd fel a dokumentumaidat és írd le a tüneteidet — AI segít megérteni és második véleményt ad. Ingyenes, anonim, GDPR-megfelelő.',
  keywords: [
    // Understanding / clarity — biggest underserved need
    'nem értem a diagnózisomat',
    'orvosi szakszavak magyarázata',
    'lelet értelmezése magyarul',
    'zárójelentés megértése',
    'laboreredmény magyarázat',
    'orvosi terminológia értelmezés',
    'mit jelent a diagnózis',
    'orvosi dokumentum értelmezése',
    'lelet mit jelent',
    'orvosi szöveg magyarázat AI',
    // Doubt / second opinion
    'orvosi második vélemény',
    'kételyem van a diagnózisommal',
    'nem biztos diagnózis',
    'második orvosi vélemény online',
    'AI orvosi tanács',
    // Symptoms
    'tünetek elemzése online',
    'tüneteim leírása AI',
    'tünetek értékelése mesterséges intelligencia',
    // AI / tech
    'mesterséges intelligencia egészség',
    'AI orvosi elemzés',
    'Claude AI orvos',
    'AI diagnózis segítség',
    // Platform descriptors
    'ingyenes orvosi konzultáció online',
    'anonim orvosi tanácsadás',
    'orvosi AI elemzés GDPR',
    'egészségügyi kérdések AI',
    'lelet feltöltés elemzés',
  ],
  authors: [{ name: 'MásodikVélemény', url: SITE_URL }],
  creator: 'MásodikVélemény',
  publisher: 'MásodikVélemény',
  category: 'health',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'MásodikVélemény – Értsd meg a diagnózisodat. AI orvosi segítség azonnal.',
    description:
      'Nem érted a leleted? Kétséged van a diagnózisoddal? Töltsd fel a dokumentumaidat — AI másodpercek alatt megmagyarázza és második véleményt ad. Anonim, ingyenes.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'MásodikVélemény – Értsd meg a diagnózisodat. AI orvosi segítség.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MásodikVélemény – Értsd meg a diagnózisodat. AI orvosi segítség.',
    description:
      'Nem érted a leleteidet? Töltsd fel PDF-ben vagy képként — az AI elmagyarázza és második véleményt ad. Ingyenes, anonim.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'hu-HU': SITE_URL },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // google: 'your-google-verification-code',
  },
}

// ── Structured Data ───────────────────────────────────────────────────────────

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MásodikVélemény',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description:
    'Magyarország vezető AI-alapú orvosi platform, amely segít megérteni a diagnózisokat, értelmezni a leleteket és orvosi második véleményt adni. Azonnali, anonim, ingyenes.',
  foundingLocation: { '@type': 'Place', addressCountry: 'HU' },
  areaServed: { '@type': 'Country', name: 'Hungary' },
  serviceType: [
    'AI Medical Second Opinion',
    'Medical Document Interpretation',
    'Diagnosis Clarification',
    'Medical Terminology Explanation',
  ],
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MásodikVélemény',
  url: SITE_URL,
  description:
    'AI-alapú platform diagnózisok megértéséhez, leletek értelmezéséhez és orvosi második vélemény kéréséhez',
  inLanguage: 'hu-HU',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MásodikVélemény AI Orvosi Asszisztens',
  url: SITE_URL,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HUF' },
  description:
    'Segít megérteni a diagnózist, értelmezi az orvosi leleteket és zárójelentéseket, magyarázza a szakmai terminológiát, és AI alapon második véleményt ad. Ingyenes, anonim, GDPR-megfelelő.',
  featureList: [
    'Diagnózis magyarázata közérthetően',
    'Orvosi szakszavak értelmezése',
    'Zárójelentés és laborlelet elemzése',
    'PDF leletek feldolgozása',
    'Orvosi képek elemzése (röntgen, MRI, ultrahang)',
    'Hang alapú tünetleírás magyarul',
    'Azonnali AI orvosi második vélemény',
    'GDPR-megfelelő, 0 adattárolás',
    'Ingyenes, regisztráció nélkül',
  ],
  screenshot: `${SITE_URL}/opengraph-image`,
  inLanguage: 'hu-HU',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" dir="ltr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      </head>
      <body>
        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
          <Disclaimer />
          <NavBar />
          <main className="flex-1 flex flex-col" id="main-content" role="main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
