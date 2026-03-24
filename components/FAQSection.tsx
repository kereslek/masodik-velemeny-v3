'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    q: 'Megérti ez az AI a laboreredményeimet és a zárójelentésemet?',
    a: 'Igen, ez az egyik legfőbb erőssége. Az AI feldolgozza a PDF-ben feltöltött laboreredményeket, zárójelentéseket, ambuláns lapokat és szakorvosi véleményeket. Közérthető, hétköznapi magyarsággal elmagyarázza, mit jelent minden egyes szakkifejezés, szám és rövidítés — még akkor is, ha az orvosi dokumentum tele van latin kifejezésekkel.',
  },
  {
    q: 'Mit tegyek, ha nem értem a diagnózisomat?',
    a: 'Töltsd fel a diagnózist tartalmazó dokumentumot PDF-ben vagy fotóban, és írd le röviden, mit nem értesz. Az AI elmagyarázza a diagnózis pontos jelentését, a benne szereplő szakkifejezéseket, és azt, hogy mindez mit jelent a mindennapjaidban. Ezen felül javaslatot ad arra is, milyen kérdéseket érdemes feltenni a következő orvosidon.',
  },
  {
    q: 'Kételyem van az orvosom diagnózisával. Helyes, ha second opiniont kérek?',
    a: 'Teljes mértékben helyes és egészséges hozzáállás. Tanulmányok szerint a betegek 20–30%-ánál módosul a diagnózis, ha egy másik szakember is megvizsgálja az esetet. A Diagnózisom.hu platformon leírhatod a tüneteidet és feltöltheted a dokumentumaidat — az AI független, elfogultságmentes elemzést ad. Ha az AI is hasonló következtetésre jut, megerősítést kapsz. Ha eltérés van, pontosabb kérdéseket tehetsz fel az orvosoddal.',
  },
  {
    q: 'Milyen orvosi dokumentumokat tud értelmezni?',
    a: 'Laboreredmények (vérkép, biokémia, vizeletvizsgálat, hormonok), zárójelentések, ambuláns lapok, szakorvosi vélemények, MRI- és CT-leletek, röntgenleletek, ultrahang-leletek, szövettani leletek, EKG-értékelések. Szöveges PDF-ként és fotóként egyaránt feldolgozza.',
  },
  {
    q: 'Mit jelent, ha a leteltemben ilyen szavak szerepelnek: „sztenokardia", „trombózis", „malignus"?',
    a: 'Az AI meg tudja magyarázni ezeket és hasonló kifejezéseket a leleted kontextusában. A sztenokardia szívgörcsöt jelent (elégtelen szívizom-vérellátás okozta mellkasi fájdalom). A trombózis vérrög kialakulását jelenti egy érben. A malignus rosszindulatút jelent, de a pontos jelentés a lelet összefüggéseitől függ. Ha ilyen szavak szerepelnek a leleteidben, töltsd fel a teljes dokumentumot a pontosabb kontextuális magyarázathoz.',
  },
  {
    q: 'Segít abban is, hogy felkészüljek a következő orvosiomra?',
    a: 'Igen, ez az egyik legértékesebb funkció. Az AI strukturált listát ad azokról a kérdésekről, amelyeket érdemes feltenni az orvosoddal. Ez segít abban, hogy tájékozottabb páciensként jelenj meg, jobb kérdéseket tegyél fel, és a rendelkezésre álló rövid idő alatt a legfontosabb dolgokra fókuszálj.',
  },
  {
    q: 'Mennyibe kerül és kell regisztrálni?',
    a: 'Teljesen ingyenes és regisztrációt sem igényel. Azonnal használhatod, személyes adatok megadása nélkül.',
  },
  {
    q: 'Biztonságos az adataim és a leleteim feltöltése?',
    a: 'Igen. Minden feltöltött dokumentum és szöveges leírás kizárólag az elemzés idejére kerül a memóriában feldolgozásra — semmit nem tárolunk adatbázisban vagy lemezen. Az eredmény megjelenése után az összes adat azonnal törlésre kerül. A rendszer automatikusan anonimizálja a személyazonosításra alkalmas adatokat (név, TAJ-szám, lakcím, telefonszám) mielőtt azok az AI-hoz kerülnek. GDPR (EU) 2016/679 szerint működünk.',
  },
  {
    q: 'Helyettesíti ez az orvosi vizsgálatot?',
    a: 'Nem, és ez fontos különbség. Az AI elemzés tájékoztató jellegű — segít megérteni, kontextusba helyez, és felkészít az orvosi konzultációra. Nem helyettesíti a szakorvosi vizsgálatot, diagnózist vagy kezelést. Sürgős esetben mindig hívd a 112-t vagy menj sürgősségire.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-extrabold text-slate-900 text-center mb-3">
        Gyakran ismételt kérdések
      </h2>
      <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto">
        Minden, amit tudni érdemes — a lelet értelmezéstől a diagnózis megértéséig.
      </p>

      {/* 
        NO microdata here — FAQPage JSON-LD is already in page.tsx as a script tag.
        Having both causes "Duplicate field: FAQPage" error in Google Search Console.
        The answers are always in the DOM (just visually hidden) so Google can read them.
      */}
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={cn(
              'health-card overflow-hidden transition-all duration-200',
              open === i ? 'shadow-health-lg' : ''
            )}
          >
            <button
              className="w-full flex items-center justify-between gap-4 p-6 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span className="font-semibold text-slate-900 text-base">{faq.q}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                  open === i ? 'rotate-180' : ''
                )}
                style={{ color: 'hsl(173,80%,40%)' }}
              />
            </button>

            {/* 
              Always render answer in DOM so Google can index it.
              Use CSS visibility instead of conditional rendering.
              When closed: height 0, overflow hidden, opacity 0 — invisible but present in DOM.
            */}
            <div
              id={`faq-answer-${i}`}
              style={{
                maxHeight: open === i ? '500px' : '0',
                overflow: 'hidden',
                opacity: open === i ? 1 : 0,
                transition: 'max-height 0.25s ease, opacity 0.2s ease',
              }}
            >
              <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
