import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, AlertTriangle, CheckCircle2, Info, FlaskConical } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vérkép értelmezése – Mit jelent minden egyes érték? | Diagnózisom.hu',
  description:
    'Közérthetően elmagyarázzuk a vérkép összes értékét: hemoglobin, fehérvérsejtszám, trombocita, MCV, CRP és még sok más. Valódi, anonimizált laborlelet alapján. Töltsd fel a sajátodat és kapj AI magyarázatot.',
  keywords: [
    'vérkép értelmezése',
    'vérkép magyarázat',
    'laboreredmény értelmezés',
    'hemoglobin mit jelent',
    'fehérvérsejt szám magyarázat',
    'trombocita mit jelent',
    'MCV MCH MCHC magyarázat',
    'vérkép normál értékek',
    'labor lelet értelmezés',
    'vérvétel eredmény magyarázat',
    'vérkép AI elemzés',
    'laboreredmény AI magyarázat',
  ],
  alternates: { canonical: 'https://diagnozisom.hu/blog/verekep-ertelmezese' },
  openGraph: {
    title: 'Vérkép értelmezése – Mit jelent minden egyes érték?',
    description:
      'Hemoglobin, fehérvérsejtszám, trombocita, MCV — közérthetően elmagyarázzuk mit jelent a vérkép minden értéke. Valódi anonimizált lelet alapján.',
    url: 'https://diagnozisom.hu/blog/verekep-ertelmezese',
    type: 'article',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  headline: 'Vérkép értelmezése – Mit jelent minden egyes érték?',
  description:
    'Közérthetően elmagyarázzuk a vérkép összes értékét egy valódi, anonimizált laborlelet alapján.',
  url: 'https://diagnozisom.hu/blog/verekep-ertelmezese',
  inLanguage: 'hu-HU',
  datePublished: '2025-03-25',
  dateModified: '2025-03-25',
  author: { '@type': 'Organization', name: 'Diagnózisom', url: 'https://diagnozisom.hu' },
  publisher: { '@type': 'Organization', name: 'Diagnózisom', url: 'https://diagnozisom.hu' },
  audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
  about: [
    { '@type': 'MedicalCondition', name: 'Vérkép laborvizsgálat' },
    { '@type': 'Thing', name: 'Laboreredmény értelmezés' },
  ],
  specialty: { '@type': 'MedicalSpecialty', name: 'Hematology' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://diagnozisom.hu' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://diagnozisom.hu/blog' },
    { '@type': 'ListItem', position: 3, name: 'Vérkép értelmezése', item: 'https://diagnozisom.hu/blog/verekep-ertelmezese' },
  ],
}

// Anonymized lab values from real example
const HEMATOLOGIA_VALUES = [
  { name: 'Fehérvérsejtszám', value: '7,9', unit: 'Giga/L', ref: '4,4–11,3', status: 'normal', note: 'Normál tartományban. A fehérvársejtek az immunrendszer sejtjei — normál érték esetén nincs akut fertőzés vagy gyulladásjel.' },
  { name: 'Vörösvérsejtszám', value: '5,2', unit: 'Tera/L', ref: '4,1–5,1', status: 'high', note: 'Enyhén emelkedett. Férfiaknál ez lehet sportolás, dehidratáció, vagy dohányzás következménye. Önmagában ritkán jelent komolyabb problémát.' },
  { name: 'Hemoglobin', value: '152', unit: 'g/L', ref: '123–153', status: 'normal', note: 'Normál. A hemoglobin az oxigénszállításért felelős fehérje. Normál érték esetén nincs vérszegénység (anémia).' },
  { name: 'Trombocitaszám', value: '339', unit: 'Giga/L', ref: '150–450', status: 'normal', note: 'Normál. A vérlemezkék a véralvadásban játszanak szerepet.' },
  { name: 'Neutrofil %', value: '44,0', unit: '%', ref: '50,0–70,0', status: 'low', note: 'Enyhén alacsony. A neutrofilek a bakteriális fertőzések elleni védekezés első vonala. Enyhe csökkenés lehet normális variáció, vírusfertőzés utáni állapot.' },
  { name: 'Limfocita %', value: '44,0', unit: '%', ref: '25,0–40,0', status: 'high', note: 'Enyhén emelkedett. A limfociták vírusfertőzések esetén szaporodnak meg. Ez összefügghet a neutrofil %-os csökkenésével — valószínűleg normális variáció.' },
  { name: 'Monocita %', value: '9,7', unit: '%', ref: '2,0–8,0', status: 'high', note: 'Enyhén emelkedett. A monociták gyulladásos állapotokban, fertőzések után emelkedhetnek meg. Általában önmagában nem aggasztó.' },
]

const KEMIA_VALUES = [
  { name: 'Kreatinin', value: '105', unit: 'µmol/L', ref: '49–90', status: 'high', note: 'Emelkedett. A kreatinin a veseműködés egyik fő mutatója. Emelkedett érték esetén érdemes az eGFR értékkel együtt értékelni.' },
  { name: 'eGFR-EPI', value: '58', unit: 'mL/min/1,73m²', ref: '>90', status: 'low', note: 'Csökkent vesefiltrációs ráta. A 60 alatti eGFR krónikus vesebetegség (CKD) jelenlétére utalhat. Ezt mindenképpen meg kell vitatni az orvossal.' },
  { name: 'Húgysav', value: '560', unit: 'µmol/L', ref: '155–357', status: 'high', note: 'Jelentősen emelkedett (hyperurikémia). Köszvény kialakulásának kockázati faktora. Étrendi változtatással és megfelelő folyadékbevitellel csökkenthető.' },
  { name: 'Koleszterin', value: '5,3', unit: 'mmol/L', ref: '<5,2', status: 'high', note: 'Enyhén emelkedett össz-koleszterin. Az LDL (3,01) normál tartományban van, a triglicerid viszont emelkedett.' },
  { name: 'Triglicerid', value: '2,59', unit: 'mmol/L', ref: '<1,71', status: 'high', note: 'Emelkedett. A magas triglicerid szint szív- és érrendszeri kockázatot jelent. Étrend és életmódváltással csökkenthető.' },
  { name: 'GPT (ALT)', value: '36', unit: 'U/L', ref: '<35', status: 'high', note: 'Határértéken. Az ALT a máj egyik fő enzime. Enyhén emelkedett értéke fáradtságból, gyógyszerektől, vagy alkoholfogyasztástól is eredhet.' },
  { name: 'Gamma GT (GGT)', value: '61', unit: 'U/L', ref: '<38', status: 'high', note: 'Emelkedett. A GGT emelkedése máj- és epehólyag-problémákra, alkoholfogyasztásra, vagy bizonyos gyógyszerekre utalhat.' },
  { name: 'Kreatinkináz (CK)', value: '291', unit: 'U/L', ref: '<146', status: 'high', note: 'Emelkedett. A CK izomkárosodás, intenzív sport, vagy statin típusú gyógyszerek mellékhatásaként emelkedik. Kontextus nélkül nehéz értékelni.' },
]

function ValueBadge({ status }: { status: string }) {
  if (status === 'high') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
      ↑ Emelkedett
    </span>
  )
  if (status === 'low') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
      ↓ Alacsony
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
      ✓ Normál
    </span>
  )
}

export default function VerekepPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-600">Főoldal</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-600">Blog</Link>
          <span>/</span>
          <span className="text-slate-600">Vérkép értelmezése</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {['vérkép', 'laboreredmény', 'hematológia', 'klinikai kémia'].map(tag => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'hsl(173,80%,93%)', color: 'hsl(173,80%,35%)' }}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Vérkép értelmezése – Mit jelent minden egyes érték?
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            A vérkép Magyarország leggyakoribb orvosi vizsgálata. Mégis, amikor a páciens
            hazamegy az eredménnyel, tele van érthetetlen rövidítésekkel és számokkal.
            Ebben a cikkben közérthetően elmagyarázzuk minden értéket — egy valódi,
            teljes mértékben anonimizált laborlelet alapján.
          </p>
          <p className="text-xs text-slate-400 mt-4">Olvasási idő: ~8 perc · Diagnózisom szerkesztőség · 2025. március</p>
        </header>

        {/* Why this matters */}
        <section className="health-card p-7 mb-8" style={{ background: 'hsl(173,80%,98%)', borderColor: 'hsl(173,80%,85%)', borderWidth: '1px', borderStyle: 'solid' }}>
          <h2 className="text-lg font-extrabold text-slate-900 mb-3">Miért fontos, hogy értsd a vérkép eredményedet?</h2>
          <div className="text-slate-700 leading-relaxed space-y-3 text-sm">
            <p>
              Tanulmányok szerint a betegek <strong>60%-a nem érti teljesen</strong> a laboreredményét,
              és nem tesz fel kérdéseket az orvosnak — mert nem tudja, mit kérdezzen.
              Ez komoly következményekkel járhat: eltérő értékek észrevétlenül maradnak,
              kezelések elmaradnak, vagy felesleges aggodalom keletkezik.
            </p>
            <p>
              A <strong>Diagnózisom.hu</strong> célja pontosan ez: segíteni megérteni a leleteidet,
              mielőtt vagy után bemész az orvoshoz. Nem diagnózist adunk — hanem
              tájékozottságot, hogy jobb kérdéseket tehess fel.
            </p>
          </div>
        </section>

        {/* What is vérkép */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Mi az a vérkép és mit mér?</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A vérkép (teljes vérképvizsgálat, angolul CBC – Complete Blood Count) a vér
            sejtjeinek számát és jellemzőit méri. Három fő sejtféleséget vizsgál:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '🔴', title: 'Vörösvérsejtek (eritrociták)', desc: 'Az oxigénszállításért felelős sejtek. Számukat, méretüket és hemoglobintartalmukat mérik.' },
              { icon: '⚪', title: 'Fehérvérsejtek (leukociták)', desc: 'Az immunrendszer sejtjei. Típusonként (neutrofil, limfocita, monocita stb.) is mérik arányukat.' },
              { icon: '🟡', title: 'Vérlemezkék (trombociták)', desc: 'A véralvadásban részt vevő sejtek. Alacsony számuk vérzékenységet, magas számuk trombóziskockázatot jelenthet.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="health-card p-5">
                <div className="text-2xl mb-2">{icon}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-700 leading-relaxed">
            A vérkép mellé általában <strong>klinikai kémiai vizsgálat</strong> is kerül,
            amely a vér kémiai összetételét méri: máj- és vesefunkciót, koleszterint,
            vércukrot, gyulladásos markereket (CRP) és sok más értéket.
          </p>
        </section>

        {/* ANONYMIZED EXAMPLE */}
        <section className="mb-10">
          <div className="flex items-start gap-3 p-4 rounded-2xl border mb-6"
            style={{ background: 'hsl(210,60%,98%)', borderColor: 'hsl(210,60%,85%)' }}>
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(210,80%,50%)' }} />
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">Valódi laborlelet — teljes anonimizálással</p>
              <p className="text-slate-600 text-xs leading-relaxed">
                Az alábbi értékek egy valódi, Synlab Budapest laboratóriumban készült
                teljes vérkép- és kémiai laborvizsgálatból származnak. Az összes személyes
                adatot (név, TAJ-szám, lakcím, születési dátum, orvos neve, laboratóriumi
                azonosítók) teljes mértékben eltávolítottuk — pontosan úgy, ahogy a
                <strong> Diagnózisom.hu</strong> is teszi automatikusan, mielőtt a feltöltött
                dokumentumod az AI-hoz kerül. A páciens: 37 éves férfi.
              </p>
            </div>
          </div>

          {/* ── All 3 pages of the anonymized lab result ── */}
          <div className="mb-10 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">Anonimizált laborlelet — valós példa (3 oldal)</h3>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl border"
              style={{ background: 'hsl(210,60%,97%)', borderColor: 'hsl(210,60%,88%)' }}>
              <span className="text-xl flex-shrink-0">🔒</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Anonimizálásról:</strong> Az alábbi lelet valós vérvizsgálat alapján készült.
                Minden személyazonosításra alkalmas adat eltávolítva: páciens neve, TAJ-szám,
                születési dátum, lakcím, orvos neve, laborazonosító és a laboratórium neve.
                Pontosan ezt végzi el automatikusan a <strong>Diagnózisom.hu</strong> is
                az általad feltöltött dokumentumokon — GDPR szerint, mielőtt az AI látja.
              </p>
            </div>

            {[
              { src: '/blog/verekep-pelda-p1.png', label: '1. oldal — Hematológia (vérkép)', alt: 'Anonimizált laborlelet 1. oldal hematológia' },
              { src: '/blog/verekep-pelda-p2.png', label: '2. oldal — Klinikai kémia (koleszterin, kreatinin, enzimek)', alt: 'Anonimizált laborlelet 2. oldal klinikai kémia' },
              { src: '/blog/verekep-pelda-p3.png', label: '3. oldal — Vizeletvizsgálat', alt: 'Anonimizált laborlelet 3. oldal vizeletvizsgálat' },
            ].map((pg, idx) => (
              <div key={pg.src}>
                <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                  <span className="inline-flex w-5 h-5 rounded-full items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'hsl(173,80%,40%)' }}>
                    {idx + 1}
                  </span>
                  {pg.label}
                </p>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <Image
                    src={pg.src}
                    alt={pg.alt}
                    width={900}
                    height={1272}
                    className="w-full h-auto"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Hematológia — a vérkép értékei</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            A hematológiai rész a vér sejtjeit vizsgálja. Nézzük meg sorban az értékeket és
            mit jelentenek a valóságban:
          </p>

          <div className="space-y-3 mb-10">
            {HEMATOLOGIA_VALUES.map((item) => (
              <div key={item.name} className="health-card p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      {item.value} {item.unit}
                      <span className="ml-2 text-xs">(ref: {item.ref})</span>
                    </span>
                  </div>
                  <ValueBadge status={item.status} />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Klinikai kémia — a fontosabb eltérések</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            A kémiai laborvizsgálat a vér kémiai összetételét méri. Ebben a leletben
            több értékes megfigyelés is van — nézzük a legfontosabb eltéréseket:
          </p>

          <div className="space-y-3 mb-8">
            {KEMIA_VALUES.map((item) => (
              <div key={item.name} className="health-card p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-slate-400 text-sm ml-2">
                      {item.value} {item.unit}
                      <span className="ml-2 text-xs">(ref: {item.ref})</span>
                    </span>
                  </div>
                  <ValueBadge status={item.status} />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>

          {/* Summary of this example */}
          <div className="health-card p-7 border-2" style={{ background: 'hsl(38,92%,98%)', borderColor: 'hsl(38,92%,75%)' }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
              <h3 className="font-extrabold text-slate-900">Mit kellene megbeszélni az orvossal ebből a leletből?</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed">
              {[
                'Az eGFR 58 és az emelkedett kreatinin miatt: van-e krónikus vesebetegség és szükséges-e követés?',
                'A magas húgysav (560) miatt: köszvény-kockázat, szükséges-e diétaváltás vagy gyógyszer?',
                'Az emelkedett GGT és GPT miatt: szükséges-e máj-ultrahang vagy az alkohol-/gyógyszerfogyasztás áttekintése?',
                'A magas triglicerid és koleszterin miatt: életmódváltás vagy gyógyszeres kezelés jön szóba?',
                'A magas CK miatt: van-e izomkárosodás, statin-szedés, vagy intenzív sport a háttérben?',
              ].map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: 'hsl(38,92%,50%)' }}>{i + 1}</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How AI helps */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
            Hogyan segít az AI a laboreredményed értelmezésében?
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A fenti elemzést manuálisan készítettük egy valódi lelet alapján —
            de a <strong>Diagnózisom.hu</strong> pontosan ezt végzi el automatikusan,
            másodpercek alatt, bármely laborlelettel:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              { title: 'PDF feltöltés', desc: 'Töltsd fel a Synlab, Medicover, Budai Egészségközpont vagy bármely más labor PDF-es leletét.' },
              { title: 'Automatikus anonimizálás', desc: 'A rendszer kiszedi a nevedet, TAJ-számodat és minden személyes adatot, mielőtt az AI látná.' },
              { title: 'Közérthető magyarázat', desc: 'Minden emelkedett vagy alacsony értékhez kapsz egy rövid, közérthető magyarázatot.' },
              { title: 'Kérdések az orvosnak', desc: 'Az AI listát állít össze a következő orvosin felteendő konkrét kérdésekből.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(173,80%,40%)' }} />
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-0.5">{title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common questions */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Gyakori kérdések a vérkép kapcsán</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Ha egy érték piros betűvel van kiemelve a leletemen, az komoly baj?',
                a: 'Nem feltétlenül. A laboratóriumok referenciatartományai statisztikai alapon készülnek — a felnőtt populáció 95%-ára vonatkoznak. Ez azt jelenti, hogy egészséges embereknél is 5%-os eséllyel esik egy érték a tartományon kívülre. Egy kiemelkedő érték kontextus nélkül nem jelent diagnózist.',
              },
              {
                q: 'Miért különböznek a referenciaértékek laboronként?',
                a: 'Minden labor saját mérőeszközöket és módszertant használ, ezért a referenciatartományok kissé eltérhetnek. Mindig az adott lelet referencia-oszlopát érdemes nézni, nem egy másik laborból megjegyzett értéket.',
              },
              {
                q: 'Éhgyomorra kell lenni a vérvételhez?',
                a: 'Bizonyos értékekhez igen — különösen a vércukorhoz (glükóz), trigliceridhez és koleszterinhez. A legtöbb labor 8–12 órás éhezést kér. Az éhezés hiánya fals emelkedett triglicerid- és vércukorértékeket okozhat.',
              },
              {
                q: 'Mit jelent a "+" és "−" jel a leletemen?',
                a: 'A "+" jel azt jelzi, hogy az érték magasabb a referenciatartomány felső határánál. A "−" jel azt jelzi, hogy alacsonyabb az alsó határnál. Piros szám általában a szignifikánsan eltérő értékeket jelzi.',
              },
            ].map(({ q, a }, i) => (
              <div key={i} className="health-card p-6">
                <h3 className="font-bold text-slate-900 mb-2 text-base">{q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-10">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Fontos nyilatkozat:</strong> Ez a cikk kizárólag tájékoztató jellegű és nem
            helyettesíti a szakorvosi vizsgálatot vagy diagnózist. A laboreredmények értelmezése
            mindig a klinikai kép és a tünetek ismeretében történhet csak helyesen.
            Ha aggasztó eltérést találsz a leletedben, fordulj kezelőorvosodhoz.
          </p>
        </div>

        {/* Big CTA */}
        <div className="health-card p-8 text-center border-2"
          style={{ background: 'linear-gradient(135deg,hsl(173,80%,97%),hsl(210,60%,97%))', borderColor: 'hsl(173,80%,70%)' }}>
          <FlaskConical className="w-10 h-10 mx-auto mb-4" style={{ color: 'hsl(173,80%,40%)' }} />
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">
            Töltsd fel a saját vérkép leletedet
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            A Diagnózisom.hu AI pontosan azt végzi el a te leleteddel, amit ebben a cikkben
            manuálisan csináltunk — de másodpercek alatt, automatikusan, teljesen anonim módon.
            Ingyenes, regisztráció nélkül.
          </p>
          <Link href="/#elemzes"
            className="inline-flex items-center gap-2 py-3.5 px-8 health-button btn-primary text-sm font-semibold">
            Vérkép feltöltése és elemzése <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-400 mt-4">
            PDF vagy fotó · Azonnal törlődik · GDPR-megfelelő
          </p>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-sm font-medium hover:underline"
            style={{ color: 'hsl(173,80%,40%)' }}>
            ← Vissza a tudástárhoz
          </Link>
        </div>

      </div>
    </>
  )
}
