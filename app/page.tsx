import type { Metadata } from 'next'
import { Brain, ShieldCheck, UploadCloud, Clock, Star, Users, BookOpen, HelpCircle, FileSearch } from 'lucide-react'
import { IntakeForm } from '@/components/IntakeForm'
import { FAQSection } from '@/components/FAQSection'

export const metadata: Metadata = {
  title: 'Értsd meg a diagnózisodat – AI orvosi segítség, lelet magyarázat, második vélemény',
  description:
    'Nem érted az orvosi leleteidet vagy a diagnózisodat? Kétséged van? Töltsd fel PDF-ben vagy képként, írd le tüneteidet — az AI közérthetően elmagyarázza és második véleményt ad. Ingyenes, anonim.',
  alternates: { canonical: 'https://diagnozisom.hu' },
  openGraph: {
    title: 'Értsd meg a diagnózisodat | Diagnózisom – AI orvosi segítség',
    description:
      'Lelet értelmezés, diagnózis magyarázat, orvosi második vélemény AI-tól — azonnal, ingyen, anonim. Töltsd fel a dokumentumaidat és kapj választ.',
    url: 'https://diagnozisom.hu',
    type: 'website',
  },
}

const medicalPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Diagnózisom.hu – Diagnózis megértés, lelet értelmezés, AI orvosi második vélemény',
  url: 'https://diagnozisom.hu',
  description:
    'Magyar pácienseknek szánt AI platform, amely segít megérteni a diagnózisokat, értelmezi az orvosi leleteket és szakkifejezéseket, valamint orvosi második véleményt nyújt.',
  inLanguage: 'hu-HU',
  audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
  lastReviewed: '2025-01-01',
  about: [
    { '@type': 'MedicalCondition', name: 'Általános orvosi kérdések' },
    { '@type': 'Thing', name: 'Orvosi dokumentum értelmezés' },
    { '@type': 'Thing', name: 'Diagnózis megértése' },
    { '@type': 'Thing', name: 'Orvosi második vélemény' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Segít ez a platform megérteni az orvosi leleteimet és zárójelentésemet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Igen, ez az egyik legfontosabb funkciója. Az AI képes feldolgozni a PDF formátumú laboreredményeket, zárójelentéseket és ambuláns lapokat, és közérthető, magyar nyelvű magyarázatot adni. Megmagyarázza a szakszavakat, számértékek jelentőségét és összefüggéseket, amiket nehéz orvos nélkül értelmezni.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mit tegyek, ha nem értem a diagnózisomat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Töltsd fel a diagnózist tartalmazó dokumentumot PDF-ben vagy fotóban a Diagnózisom.hu platformra, és írd le röviden a helyzetedet. Az AI elmagyarázza a diagnózis jelentését, a benne lévő szakkifejezéseket, és segít megérteni, mit jelent ez a mindennapi életedben. Ezen felül javaslatot ad arra is, milyen kérdéseket tegyél fel az orvosoddal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kételyem van az orvosom diagnózisával kapcsolatban. Mit tehetek?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Teljesen normális és egészséges, ha valaki második véleményt kér a diagnózisára. A Diagnózisom.hu platformon leírhatod a tüneteidet és feltöltheted a dokumentumaidat, és az AI független elemzést ad. Ha az AI is hasonló következtetésre jut, az megerősítést adhat. Ha eltérés van, az segíthet pontosabb kérdéseket feltenni az orvosoddal. A platform nem helyettesíti a szakorvosi vizsgálatot, de segít tájékozottabb páciensként megjelenni a rendelőben.',
      },
    },
    {
      '@type': 'Question',
      name: 'Milyen orvosi dokumentumokat tud értelmezni az AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Az AI képes értelmezni laboreredményeket (vérkép, biokémia, vizelet), zárójelentéseket, ambuláns lapokat, szakorvosi véleményeket, MRI és CT leleteket, röntgen leleteket, ultrahang leleteket és szövettani leleteket. A dokumentumokat PDF formátumban vagy fotóként töltheted fel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mit jelent például a "sztenokardia", "trombózis", "invazív karcinóma" kifejezés?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Az AI meg tudja magyarázni az ilyen orvosi szakkifejezések jelentését közérthetően. A sztenokardia szívgörcsöt, mellkasi fájdalmat jelent, amit a szívizom elégtelen vérellátása okoz. A trombózis vérrög kialakulását jelenti egy érben. Az invazív karcinóma a környező szövetbe benövő daganatot jelöl. Ha ilyen fogalmakkal találkozol a leleteidben, töltsd fel a dokumentumot és az AI az összefüggéseiben magyarázza el.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mennyibe kerül és kell-e regisztrálni?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Diagnózisom.hu teljesen ingyenes és regisztrációt sem igényel. Azonnal használhatod, személyes adatok megadása nélkül.',
      },
    },
    {
      '@type': 'Question',
      name: 'Milyen AI modell elemzi a dokumentumaimat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A platform az Anthropic által fejlesztett Claude Sonnet AI modellt használja, amely az egyik legfejlettebb orvosi szövegértésre és képelemzésre képes nagy nyelvi modell. Képes egyszerre szöveget és képeket is feldolgozni, és orvosi kontextusban értelmezni a feltöltött dokumentumokat.',
      },
    },
    {
      '@type': 'Question',
      name: 'Biztonságos az adataim feltöltése?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Igen. Minden feltöltött dokumentum és szöveges leírás kizárólag az elemzés idejére kerül feldolgozásra a memóriában — semmit nem tárolunk adatbázisban vagy lemezen. Az eredmény megjelenése után az összes adat azonnal törlésre kerül. A rendszer automatikusan anonimizálja a személyazonosításra alkalmas adatokat (név, TAJ-szám, lakcím) mielőtt azok az AI-hoz kerülnek. GDPR (EU) 2016/679 szerint működünk.',
      },
    },
  ],
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Hogyan értelmezd az orvosi leleteidet AI segítségével?',
  description: 'Lépésről lépésre: hogyan töltsd fel a leleteidet és kapj közérthető magyarázatot',
  inLanguage: 'hu-HU',
  totalTime: 'PT2M',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Add meg az alapadataidat', text: 'Írd be az életkorodat és válaszd ki a nemet. Ezek segítik az AI-t a kontextus megértésében.' },
    { '@type': 'HowToStep', position: 2, name: 'Töltsd fel a dokumentumodat', text: 'PDF-ben vagy fotóban csatold a leleteidet: laboreredmény, zárójelentés, ambuláns lap, szakorvosi vélemény.' },
    { '@type': 'HowToStep', position: 3, name: 'Írd le a kérdésedet vagy tüneteidet', text: 'Mondd el saját szavaiddal, mit nem értesz, miben kételkedsz, vagy milyen tüneteid vannak.' },
    { '@type': 'HowToStep', position: 4, name: 'Kérj AI magyarázatot', text: 'Az AI közérthető magyar nyelven elmagyarázza a lelet tartalmát, a szakkifejezéseket és összefüggéseket.' },
    { '@type': 'HowToStep', position: 5, name: 'Olvasd az eredményt és tegyél fel kérdéseket', text: 'Kapj strukturált magyarázatot, ajánlott teendőket és kérdéseket, amiket az orvosoddal érdemes megbeszélni.' },
  ],
}

// Three primary use cases as schema entities
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Diagnózisom AI Orvosi Asszisztens',
  url: 'https://diagnozisom.hu',
  serviceType: 'Health Information Service',
  description: 'Három fő szolgáltatás: (1) Orvosi leletek és diagnózisok közérthető magyarázata, (2) Orvosi szakkifejezések értelmezése, (3) AI-alapú orvosi második vélemény tünetek és dokumentumok alapján.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI Orvosi Segítség',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Diagnózis és lelet magyarázat',
        description: 'Közérthetően elmagyarázzuk a diagnózisodat és a leletek tartalmát',
        price: '0',
        priceCurrency: 'HUF',
      },
      {
        '@type': 'Offer',
        name: 'Orvosi terminológia értelmezés',
        description: 'Szakkifejezések, latin és angol orvosi szavak közérthető magyarázata',
        price: '0',
        priceCurrency: 'HUF',
      },
      {
        '@type': 'Offer',
        name: 'AI orvosi második vélemény',
        description: 'Független AI elemzés tünetekre és feltöltött orvosi dokumentumokra',
        price: '0',
        priceCurrency: 'HUF',
      },
    ],
  },
  provider: { '@type': 'Organization', name: 'Diagnózisom', url: 'https://diagnozisom.hu' },
  areaServed: { '@type': 'Country', name: 'Hungary' },
  inLanguage: 'hu-HU',
  audience: { '@type': 'Audience', audienceType: 'Patient' },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: '1000px', height: '600px', opacity: 0.25 }} aria-hidden="true">
          <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'linear-gradient(to right, hsl(173,60%,80%), hsl(210,80%,85%))', mixBlendMode: 'multiply' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-24">

          {/* ── Hero ── */}
          <header className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-8 shadow-sm"
              style={{ background: 'hsl(173,80%,97%)', borderColor: 'hsl(173,80%,88%)', color: 'hsl(173,80%,35%)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'hsl(173,80%,60%)' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'hsl(173,80%,40%)' }} />
              </span>
              Ingyenes · Anonim · Regisztráció nélkül
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Értsd meg a diagnózisodat.{' '}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, hsl(173,80%,40%), hsl(195,80%,50%))' }}>
                AI segítség azonnal.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
              Nem érted a leleteidet? Kétséged van a diagnózisoddal kapcsolatban?
              Szeretnéd tudni, mit jelent egy orvosi szakkifejezés?
              Töltsd fel a dokumentumaidat és írd le a helyzetedet —
              az AI közérthetően elmagyarázza és második véleményt ad.
            </p>

            {/* Three use case cards — the core positioning */}
            <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
              {[
                {
                  icon: BookOpen,
                  title: 'Értem a leleteimet',
                  body: 'Laboreredmény, zárójelentés, szakorvosi vélemény — az AI elmagyarázza közérthetően, mit jelent és mi a fontos benne.',
                },
                {
                  icon: HelpCircle,
                  title: 'Kételyem van',
                  body: 'Nem vagy biztos a diagnózisodban? Az AI független szemmel elemzi az adataidat és megerősít vagy felhívja a figyelmed az eltérésekre.',
                },
                {
                  icon: FileSearch,
                  title: 'AI második vélemény',
                  body: 'Töltsd fel a tüneteidet és dokumentumaidat, és kapj strukturált AI orvosi második véleményt másodpercek alatt.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="health-card p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'hsl(173,80%,93%)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">{title}</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: Brain, text: 'Claude AI · Anthropic' },
                { icon: ShieldCheck, text: 'GDPR · 0 adattárolás' },
                { icon: UploadCloud, text: 'PDF + kép + hang' },
                { icon: Clock, text: '~10 mp alatt' },
                { icon: Star, text: 'Ingyenes' },
                { icon: Users, text: 'Regisztráció nélkül' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-xs text-slate-600 font-medium">
                  <Icon className="w-3.5 h-3.5" style={{ color: 'hsl(173,80%,40%)' }} />
                  {text}
                </div>
              ))}
            </div>
          </header>

          {/* ── Intake Form ── */}
          <section id="elemzes" className="scroll-mt-24" aria-labelledby="form-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'hsl(173,80%,40%)' }}>✦</div>
              <h2 id="form-heading" className="text-2xl font-extrabold text-slate-900">
                Írj le mindent — mi megmagyarázzuk
              </h2>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <IntakeForm />
          </section>

          {/* ── How it works ── */}
          <section className="mt-20" aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-2xl font-extrabold text-slate-900 text-center mb-3">
              Hogyan működik?
            </h2>
            <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto">
              Mindegy, hogy leletet akarsz megértetni, diagnózisban vagy bizonytalan,
              vagy csak second opiniont kérsz — a folyamat ugyanaz.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Leírod a helyzetedet',
                  body: 'Saját szavaiddal: mit nem értesz, miben vagy bizonytalan, mik a tüneteid. Nincs szükség orvosi szakkifejezésekre. Hangos diktálás is lehetséges magyarul.',
                },
                {
                  step: '02',
                  title: 'Feltöltöd a dokumentumaidat',
                  body: 'PDF-ben vagy fotóban csatolod a leleteidet, zárójelentésedet, laboreredményeidet. Az AI olvas és értelmez szöveget és képet egyaránt.',
                },
                {
                  step: '03',
                  title: 'Az AI elmagyaráz és elemez',
                  body: 'Közérthető magyarázatot kapsz a diagnózisodról és a leleteid tartalmáról, a szakkifejezések jelentéséről, és az orvosoddal megbeszélendő kérdésekről.',
                },
              ].map(({ step, title, body }) => (
                <article key={step} className="health-card p-7">
                  <div className="text-4xl font-extrabold mb-4 opacity-15 select-none font-display" style={{ color: 'hsl(173,80%,40%)' }}>{step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Use cases — rich semantic text for AI crawlers ── */}
          <section className="mt-16 space-y-6" aria-labelledby="usecases-heading">
            <h2 id="usecases-heading" className="text-2xl font-extrabold text-slate-900 mb-8">
              Mikor segít ez a platform?
            </h2>

            {/* Use case 1: Clarity */}
            <article className="health-card p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(173,80%,93%)' }}>
                  <BookOpen className="w-6 h-6" style={{ color: 'hsl(173,80%,40%)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    „Megkaptam a leletem, de nem értem, mit jelent"
                  </h3>
                  <div className="text-slate-600 leading-relaxed space-y-3 text-base">
                    <p>
                      Az egyik legtöbb embert érintő helyzet: a laborból, a szakrendelőről vagy a
                      kórházból hazajöttél egy <strong>laboreredménnyel, zárójelentéssel vagy
                      ambuláns lappal</strong> — tele latin szakkifejezésekkel, rövidítésekkel és
                      számokkal, amiket nehéz értelmezni orvosi végzettség nélkül.
                    </p>
                    <p>
                      A Diagnózisom.hu platform lehetővé teszi, hogy PDF-ben vagy képként
                      feltöltsd a dokumentumodat. Az AI <strong>közérthető, hétköznapi
                      magyarsággal</strong> elmagyarázza a lelet tartalmát: mit jelentenek a
                      számok, mi az eltérés a normáltól, melyek a lényeges részek, és mire érdemes
                      felfigyelni. Különösen hasznos, ha a következő időpontod még napokra vagy
                      hetekre van, és addig is szeretnéd érteni a helyzetedet.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Use case 2: Doubt */}
            <article className="health-card p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(195,80%,93%)' }}>
                  <HelpCircle className="w-6 h-6" style={{ color: 'hsl(195,80%,45%)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    „Kételyem van a diagnózisommal kapcsolatban"
                  </h3>
                  <div className="text-slate-600 leading-relaxed space-y-3 text-base">
                    <p>
                      Orvosi tanulmányok szerint a betegek <strong>20–30%-ánál módosul a diagnózis
                      vagy a kezelési javaslat</strong>, ha egy második szakember is megvizsgálja
                      az esetet. A második vélemény kérése nem „hitetlenkedés" — hanem az
                      egészségtudatos magatartás része.
                    </p>
                    <p>
                      Ha bizonytalan vagy az orvosod megállapításában, feltöltheted a
                      dokumentumaidat és leírhatod a tüneteidet. Az AI <strong>független
                      szemmel</strong> elemzi az adataidat, jelzi, ha valami következetlenséget
                      lát, és kérdéseket fogalmaz meg, amiket az orvosoddal érdemes megbeszélni.
                      Nem az orvos ellen, hanem <em>a jobb párbeszéd érdekében</em>.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Use case 3: Understanding situation */}
            <article className="health-card p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(210,80%,93%)' }}>
                  <FileSearch className="w-6 h-6" style={{ color: 'hsl(210,80%,50%)' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    „Szeretném jobban megérteni az egészségügyi helyzetemett"
                  </h3>
                  <div className="text-slate-600 leading-relaxed space-y-3 text-base">
                    <p>
                      Sokszor az orvos kevés időt tud szánni a részletes magyarázatra. Hazamész
                      a diagnózisoddal, de valójában <strong>nem tudod, mi vár rád</strong>: mit
                      jelent ez hosszú távon, milyen életmódbeli változásokat von maga után,
                      mikor kell ismét orvoshoz menni, vagy mire figyelj a tünetek változásánál.
                    </p>
                    <p>
                      A Diagnózisom.hu platform segít ebben a „köztes térben": felvilágosít,
                      kontextusba helyez, <strong>kérdéseket fogalmaz meg a következő
                      orvosihoz</strong>, és segít megalapozottabb döntést hozni a saját
                      egészségeddel kapcsolatban. Tájékozottabb páciens jobb kérdéseket tesz
                      fel — és jobb ellátást kap.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </section>

          {/* ── Why AI can help — trust-building content ── */}
          <section className="mt-10 health-card p-8 md:p-10" aria-labelledby="why-heading">
            <h2 id="why-heading" className="text-xl font-extrabold text-slate-900 mb-5">
              Miért érdemes AI-t kérni orvosi kérdésekben?
            </h2>
            <div className="text-slate-600 leading-relaxed space-y-4 text-base">
              <p>
                A modern nagy nyelvi modellek — különösen az Anthropic <strong>Claude Sonnet</strong>
                &nbsp;modellje — rendkívül magas szinten értik az orvosi szöveget, képesek
                PDF-dokumentumokat feldolgozni, és orvosi képeket (röntgen, MRI, ultrahang, bőrgyógy
                ászati fotók) elemezni. A modell nem „gugliz" — valóban érti a kontextust.
              </p>
              <p>
                A Diagnózisom.hu célja nem az, hogy az orvost helyettesítse, hanem hogy{' '}
                <strong>betöltse azt a részt</strong>, amit az orvos nem tud betölteni: az
                otthoni magyarázatot, a türelmes kérdezés lehetőségét, a kételyek megvizsgálását
                és a következő orvosihoz való felkészülést. Ingyenes, azonnali és teljesen anonim.
              </p>
              <p>
                <strong>Fontos korlát:</strong> az AI elemzés tájékoztató jellegű és nem
                helyettesíti a szakorvosi vizsgálatot. Sürgős esetben mindig hívja a{' '}
                <strong>112-t</strong>.
              </p>
            </div>
          </section>

          {/* ── FAQ ── */}
          <FAQSection />
        </div>
      </div>
    </>
  )
}
