import type { Metadata } from 'next'
import './globals.css'
import { Disclaimer } from '@/components/Disclaimer'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://diagnozisom.hu'
const SITE_NAME = 'Diagnózisom'
const TAGLINE = 'Második vélemény, azonnal, ingyen, anonim'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Diagnózisom.hu – ${TAGLINE}`,
    template: `%s | Diagnózisom.hu`,
  },
  description:
    'Nem érted a diagnózisodat vagy a leleted? Kétséged van az orvosi véleménnyel? Töltsd fel a dokumentumaidat és írd le a tüneteidet — AI orvosi második véleményt adsz azonnal, ingyen és teljesen anonim módon. GDPR-megfelelő.',
  keywords: [
    // Brand + tagline
    'Diagnózisom',
    'diagnozisom.hu',
    'második vélemény azonnal',
    'második vélemény ingyen',
    'második vélemény anonim',
    // Core use cases — what people actually type
    'orvosi második vélemény',
    'második orvosi vélemény online',
    'nem értem a diagnózisomat',
    'diagnózis megértése',
    'lelet értelmezése magyarul',
    'zárójelentés megértése',
    'laboreredmény magyarázat',
    'orvosi szakszavak értelmezése',
    'orvosi dokumentum értelmezés AI',
    'mit jelent a diagnózis',
    'lelet mit jelent',
    // Doubt / second opinion
    'kételyem van a diagnózisommal',
    'második vélemény kérése',
    'orvosi vélemény online',
    'ingyenes orvosi tanácsadás',
    'anonim orvosi kérdés',
    // AI / tech
    'AI orvosi elemzés',
    'mesterséges intelligencia egészség',
    'Claude AI orvos',
    'AI diagnózis segítség',
    'egészségügyi AI Magyar',
    // Symptoms
    'tünetek elemzése online',
    'tüneteim leírása AI',
    'orvosi AI Magyarország',
  ],
  authors: [{ name: 'Diagnózisom', url: SITE_URL }],
  creator: 'Diagnózisom',
  publisher: 'Diagnózisom',
  category: 'health',
  applicationName: SITE_NAME,
  manifest: '/manifest.json',
  referrer: 'origin-when-cross-origin',
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
    title: `Diagnózisom.hu – ${TAGLINE}`,
    description:
      'Nem érted a leleted? Kétséged van a diagnózisoddal? Töltsd fel a dokumentumaidat — AI másodpercek alatt megmagyarázza és orvosi második véleményt ad. Teljesen anonim, ingyenes.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `Diagnózisom.hu – ${TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Diagnózisom.hu – ${TAGLINE}`,
    description:
      'Értsd meg a diagnózisodat. Töltsd fel leleteidet PDF-ben vagy képként — az AI elmagyarázza és orvosi második véleményt ad. Ingyen, anonim.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'hu-HU': SITE_URL },
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.ico', type: 'image/x-icon' }],
    apple: '/favicon.ico',
  },
  verification: {
    // google: 'your-google-verification-code',
  },
}

// ── JSON-LD Structured Data ───────────────────────────────────────────────────

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Diagnózisom',
  alternateName: 'Diagnózisom.hu',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    'Magyarország vezető AI-alapú orvosi platform, amely segít megérteni a diagnózisokat, értelmezni a leleteket és orvosi második véleményt adni. Második vélemény, azonnal, ingyen, anonim.',
  slogan: TAGLINE,
  foundingLocation: { '@type': 'Place', addressCountry: 'HU' },
  areaServed: { '@type': 'Country', name: 'Hungary' },
  serviceType: [
    'AI Medical Second Opinion',
    'Medical Document Interpretation',
    'Diagnosis Clarification',
    'Medical Terminology Explanation',
  ],
  contactPoint: [
    { '@type': 'ContactPoint', email: 'info@diagnozisom.hu', contactType: 'customer support', availableLanguage: 'Hungarian' },
    { '@type': 'ContactPoint', email: 'partner@diagnozisom.hu', contactType: 'sales', availableLanguage: 'Hungarian' },
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Diagnózisom.hu',
  alternateName: ['Diagnózisom', 'Diagnozisom'],
  url: SITE_URL,
  description: `AI-alapú orvosi második vélemény platform magyar pácienseknek. ${TAGLINE}.`,
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
  name: 'Diagnózisom – AI Orvosi Asszisztens',
  alternateName: 'Diagnózisom.hu',
  url: SITE_URL,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'HUF', availability: 'https://schema.org/InStock' },
  description:
    'Orvosi második vélemény, diagnózis megértés és lelet értelmezés AI segítségével. Második vélemény, azonnal, ingyen, anonim. GDPR-megfelelő, 0 adattárolás.',
  featureList: [
    'Diagnózis közérthető magyarázata',
    'Orvosi szakszavak értelmezése',
    'Zárójelentés és laborlelet elemzése',
    'PDF leletek feldolgozása',
    'Orvosi képek elemzése (röntgen, MRI, ultrahang)',
    'Hang alapú tünetleírás magyarul',
    'Azonnali AI orvosi második vélemény',
    'Teljes anonimitás, GDPR-megfelelő',
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
          <NavBar />
          <main className="flex-1 flex flex-col" id="main-content" role="main">
            {children}
          </main>
          <Footer />
          <Disclaimer />
        </div>
      </body>
    </html>
  )
}
