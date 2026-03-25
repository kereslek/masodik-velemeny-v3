import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Orvosi tudástár – Lelet értelmezés, vérkép magyarázat, diagnózis útmutatók',
  description:
    'Közérthető cikkek a laboreredmények, vérkép, zárójelentések és orvosi szakkifejezések értelmezéséhez. Magyar pácienseknek, AI-alapú magyarázatokkal.',
  alternates: { canonical: 'https://diagnozisom.hu/blog' },
  openGraph: {
    title: 'Orvosi tudástár | Diagnózisom.hu',
    description: 'Közérthető útmutatók laboreredmények, vérkép és diagnózisok értelmezéséhez.',
    url: 'https://diagnozisom.hu/blog',
  },
}

const POSTS = [
  {
    slug: 'verekep-ertelmezese',
    title: 'Vérkép értelmezése – Mit jelent minden egyes érték?',
    excerpt:
      'A vérkép az egyik leggyakoribb laborvizsgálat, mégis tele van érthetetlen rövidítésekkel és számokkal. Ebben a cikkben közérthetően elmagyarázzuk, mit jelent a hemoglobin, a fehérvérsejtszám, a trombocita és a többi érték — egy valódi, anonimizált laborlelet alapján.',
    date: '2025. március',
    readTime: '8 perc',
    tags: ['vérkép', 'laboreredmény', 'hematológia'],
    featured: true,
  },
]

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Diagnózisom – Orvosi tudástár',
  url: 'https://diagnozisom.hu/blog',
  description: 'Közérthető cikkek laboreredmények, vérkép és orvosi diagnózisok értelmezéséhez',
  inLanguage: 'hu-HU',
  publisher: {
    '@type': 'Organization',
    name: 'Diagnózisom',
    url: 'https://diagnozisom.hu',
  },
}

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6"
            style={{ background: 'hsl(173,80%,97%)', borderColor: 'hsl(173,80%,88%)', color: 'hsl(173,80%,35%)' }}>
            Orvosi tudástár
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Lelet értelmezés, vérkép magyarázat, diagnózis útmutatók
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Közérthető cikkek, amelyek segítenek megérteni a laboreredményeidet,
            a vérkép értékeit és az orvosi szakkifejezéseket — hogy tájékozottabban
            jelenj meg a következő orvosidon.
          </p>
        </header>

        <div className="space-y-6">
          {POSTS.map(post => (
            <article key={post.slug}
              className={`health-card p-7 md:p-9 hover:-translate-y-0.5 transition-all duration-200 ${post.featured ? 'border-2' : ''}`}
              style={post.featured ? { borderColor: 'hsl(173,80%,70%)' } : {}}>

              {post.featured && (
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                  style={{ background: 'hsl(173,80%,93%)', color: 'hsl(173,80%,35%)' }}>
                  Kiemelt cikk
                </span>
              )}

              <h2 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:underline decoration-2"
                  style={{ textDecorationColor: 'hsl(173,80%,40%)' }}>
                  {post.title}
                </Link>
              </h2>

              <p className="text-slate-600 leading-relaxed mb-5">{post.excerpt}</p>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} olvasás</span>
                  <span>{post.date}</span>
                  <div className="flex gap-1.5">
                    {post.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`}
                  className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: 'hsl(173,80%,40%)' }}>
                  Elolvasom <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 health-card p-8 text-center"
          style={{ background: 'linear-gradient(135deg,hsl(173,80%,98%),hsl(210,60%,98%))' }}>
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">
            Értsd meg a saját leleteidet most
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            Töltsd fel a laboreredményeidet vagy írd le a tüneteidet — az AI
            azonnal, közérthetően elmagyarázza és második véleményt ad.
          </p>
          <Link href="/#elemzes"
            className="inline-flex items-center gap-2 py-3 px-7 health-button btn-primary text-sm font-semibold">
            Ingyenes elemzés indítása <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
