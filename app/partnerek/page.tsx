import type { Metadata } from 'next'
import { Stethoscope, BarChart2, Shield, Mail, ArrowRight, Users, TrendingUp, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Orvosi Partnereknek – Csatlakozzon hálózatunkhoz',
  description:
    'Orvosoknak, egészségügyi intézményeknek és klinikáknak szóló partnerprogram. Elérjük a tüneteikkel aktívan foglalkozó pácienseket. GDPR-megfelelő, mérhető eredmények.',
  alternates: {
    canonical: 'https://masodikvelemeny.hu/partnerek',
  },
  openGraph: {
    title: 'Orvosi Partnereknek | MásodikVélemény',
    description:
      'Csatlakozzon a MásodikVélemény orvosi partnerhálózatához. Minősített páciensek, GDPR-megfelelőség, mérhető eredmények.',
    url: 'https://masodikvelemeny.hu/partnerek',
  },
}

const partnerSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'MásodikVélemény Orvosi Partnerprogram',
  url: 'https://masodikvelemeny.hu/partnerek',
  description:
    'Orvosoknak és egészségügyi intézményeknek szóló partnerprogram. Minősített páciensek elérése AI-alapú egészségügyi platformon keresztül.',
  provider: {
    '@type': 'Organization',
    name: 'MásodikVélemény',
    url: 'https://masodikvelemeny.hu',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Hungary',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Medical Professionals',
  },
}

export default function PartnerekPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(partnerSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <header className="text-center max-w-2xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6 shadow-sm"
            style={{ background: 'hsl(173,80%,97%)', borderColor: 'hsl(173,80%,88%)', color: 'hsl(173,80%,35%)' }}
          >
            Orvosi partnereknek
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Legyen partnerünk
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            A MásodikVélemény platformon keresztül azokat a pácienseket érjük el,
            akik aktívan keresnek megbízható orvosi segítséget és tájékozottan akarnak
            dönteni az egészségükről. Csatlakozzon hálózatunkhoz és növelje praxisát.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { value: '100%', label: 'GDPR megfelelő' },
            { value: '~10s', label: 'Átlagos elemzési idő' },
            { value: '0', label: 'Tárolt egészségügyi adat' },
          ].map(({ value, label }) => (
            <div key={label} className="health-card p-5 text-center">
              <div className="text-3xl font-extrabold text-slate-900 mb-1" style={{ color: 'hsl(173,80%,40%)' }}>
                {value}
              </div>
              <div className="text-sm text-slate-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <section aria-labelledby="benefits-heading" className="mb-16">
          <h2 id="benefits-heading" className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
            Mit kap partnerként?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Minősített Páciensek',
                desc: 'Olyan pácienseket küldünk, akik már tudják, mire van szükségük – előminősített, motivált, tájékozott ügyfelek, akik konkrét kérdésekkel érkeznek.',
              },
              {
                icon: BarChart2,
                title: 'Analitika & Riportok',
                desc: 'Heti kimutatások, elérési mutatók és konverziókövetés a partnerportálon keresztül. Látja, honnan jönnek a páciensek.',
              },
              {
                icon: Shield,
                title: 'GDPR Megfelelőség',
                desc: 'A platform teljes körű adatvédelmi megfelelőséggel működik. Sem Önnek, sem nekünk nincs jogi kockázata.',
              },
              {
                icon: TrendingUp,
                title: 'Online Jelenlét Erősítése',
                desc: 'Partnerlistán való megjelenés a MásodikVélemény platformon, amely folyamatosan növekvő organikus forgalommal rendelkezik.',
              },
              {
                icon: Stethoscope,
                title: 'Szakmai Profil',
                desc: 'Részletes szakorvosi profil: szakterület, elérhetőség, rendelési idők, különleges kompetenciák kiemelése.',
              },
              {
                icon: CheckCircle2,
                title: 'Egyszerű Integráció',
                desc: 'Nincs szükség IT-fejlesztésre. Önnek csak a profil adatait kell megadnia, mi elvégezzük a technikai munkát.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article key={title} className="health-card p-7">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'hsl(173,80%,93%)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: 'hsl(173,80%,40%)' }} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Who is it for */}
        <section className="health-card p-8 md:p-10 mb-14" aria-labelledby="for-whom-heading">
          <h2 id="for-whom-heading" className="text-xl font-extrabold text-slate-900 mb-4">
            Kinek szól a partnerprogram?
          </h2>
          <ul className="space-y-3 text-slate-600 leading-relaxed">
            {[
              'Háziorvosok és belgyógyászok, akik növelni szeretnék a magánrendelésük forgalmát',
              'Szakorvosok (kardiológus, neurológus, ortopéd, bőrgyógyász stb.) akik online elérhetőek szeretnének lenni',
              'Magánklinikák és diagnosztikai központok, akik online páciensszerzési csatornát keresnek',
              'Egészségügyi szolgáltatók, akik tájékozottabb, motivált páciensekkel szeretnének dolgozni',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(173,80%,40%)' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div
          className="health-card p-10 text-center"
          style={{ background: 'linear-gradient(135deg, hsl(173,80%,97%), hsl(210,60%,97%))' }}
        >
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Érdeklődik?</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Vegye fel velünk a kapcsolatot és 48 órán belül visszajelzünk a
            partnerségi lehetőségekről. Nincs elköteleződés.
          </p>
          <a
            href="mailto:partner@masodikvelemeny.hu"
            className="inline-flex items-center gap-2 py-3.5 px-8 health-button btn-primary text-sm font-semibold"
          >
            <Mail className="w-4 h-4" />
            Kapcsolatfelvétel
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-400 mt-4">
            partner@masodikvelemeny.hu · Válasz 48 órán belül
          </p>
        </div>

      </div>
    </>
  )
}
