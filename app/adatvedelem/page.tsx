import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adatvédelmi Tájékoztató – GDPR megfelelő adatkezelés',
  description:
    'A MásodikVélemény platform adatvédelmi tájékoztatója. Nem tárolunk személyes egészségügyi adatot. GDPR (EU) 2016/679 szerint működünk. Olvasd el, hogyan kezeljük az adataidat.',
  alternates: {
    canonical: 'https://masodikvelemeny.hu/adatvedelem',
  },
  robots: {
    index: true,
    follow: false,
  },
}

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Adatvédelmi Tájékoztató – MásodikVélemény',
  url: 'https://masodikvelemeny.hu/adatvedelem',
  description: 'GDPR-megfelelő adatvédelmi tájékoztató. Az egészségügyi adatokat nem tároljuk.',
  inLanguage: 'hu-HU',
  about: {
    '@type': 'Thing',
    name: 'GDPR adatvédelem',
  },
}

const sections = [
  {
    title: '1. Milyen adatokat gyűjtünk?',
    body: 'Az elemzés során megadott adatok (kor, nem, helyszín, tünetleírás, feltöltött fájlok) kizárólag az AI elemzés elvégzéséhez kerülnek felhasználásra. Ezeket az adatokat semmilyen adatbázisban nem tároljuk. Az elemzés elkészülte után az összes beküldött adat azonnal és véglegesen törlésre kerül a rendszerből. A platform nem használ sütit (cookie) és nem követ nyomon egyetlen felhasználót sem.',
  },
  {
    title: '2. Hogyan kezeljük az adatokat?',
    body: 'A feltöltött fájlok (PDF, képek) kizárólag a szerver memóriájában kerülnek feldolgozásra — nem írjuk ki őket lemezre, nem kerülnek felhőtárhelyre. A szöveges tartalmakból automatikus anonimizálási folyamat távolítja el a személyazonosításra alkalmas adatokat (nevek, TAJ-számok, lakcímek, telefonszámok) mielőtt azok az AI modellhez kerülnének. Ez az eljárás az adatok AI általi feldolgozása előtt fut le.',
  },
  {
    title: '3. Harmadik felek',
    body: 'Az elemzés elvégzéséhez az Anthropic vállalat által fejlesztett Claude AI modellt vesszük igénybe (claude-sonnet-4-20250514). Az Anthropic API-hoz küldött adatokat az Anthropic saját adatvédelmi szabályzata szerint kezeli (privacy.anthropic.com). Más harmadik félnek nem adjuk át az adatokat. A platform nem tartalmaz hirdetési vagy analitikai sütiket.',
  },
  {
    title: '4. Sütik és munkamenet-tároló',
    body: 'Az alkalmazás kizárólag funkcionálisan szükséges, munkamenet-szintű tárolást (sessionStorage) használ — ezt is csak az elemzési eredmény átmeneti, egyszeri megjelenítéséhez. Ez az adat kizárólag a böngésző aktuális lapján él, és a lap bezárásakor automatikusan törlődik. Harmadik féltől származó sütiket (tracking, marketing, analitika) nem alkalmazunk.',
  },
  {
    title: '5. Az Ön jogai (GDPR)',
    body: 'Az (EU) 2016/679 (GDPR) rendelet alapján Önt hozzáférési, helyesbítési, törlési, adathordozhatósági és tiltakozási jog illeti meg. Mivel személyes egészségügyi adatot nem tárolunk, törlési kérelem benyújtása technikailag nem releváns — az adatok az elemzés befejezése után azonnal törlésre kerülnek. Adatvédelmi kérdéseivel forduljon hozzánk: adatvedelem@masodikvelemeny.hu',
  },
  {
    title: '6. Adatbiztonság',
    body: 'A platform HTTPS protokollon keresztül, titkosított kapcsolaton kommunikál. A szerver oldali feldolgozás kizárólag a Vercel felhőinfrastruktúráján történik, amely SOC 2 Type II tanúsítvánnyal rendelkezik. Az adatok semmilyen formában nem kerülnek naplózásra.',
  },
]

export default function AdatvedelemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Adatvédelmi Tájékoztató
          </h1>
          <p className="text-slate-500">
            Utoljára frissítve: 2025. január — GDPR (EU) 2016/679 rendelet szerint
          </p>
        </header>

        {/* Key privacy guarantee highlighted */}
        <div
          className="p-5 rounded-2xl mb-10 flex items-start gap-4"
          style={{ background: 'hsl(173,80%,97%)', border: '1px solid hsl(173,80%,88%)' }}
        >
          <div className="text-2xl flex-shrink-0">🔒</div>
          <div>
            <p className="font-bold text-slate-900 mb-1">Alapelv: ha nem tároljuk, nem szivároghat ki.</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              A MásodikVélemény adatvédelmi architektúrájának alapja, hogy
              egészségügyi adatokat egyáltalán nem tárolunk. Nincs adatbázis,
              nincs napló, nincs felhőtároló — az adatok csak az elemzés idejére
              kerülnek memóriában feldolgozásra.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map(({ title, body }) => (
            <article key={title} className="health-card p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong>Kapcsolat:</strong> adatvedelem@masodikvelemeny.hu ·{' '}
            <strong>Felügyelet:</strong> Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH),{' '}
            <a href="https://naih.hu" className="underline hover:text-slate-700" target="_blank" rel="noopener noreferrer">
              naih.hu
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
