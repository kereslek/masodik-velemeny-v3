import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*',            allow: '/', disallow: ['/api/', '/eredmeny'] },
      { userAgent: 'GPTBot',       allow: '/', disallow: ['/api/', '/eredmeny'] },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot',    allow: '/' },
      { userAgent: 'Claude-Web',   allow: '/' },
      { userAgent: 'PerplexityBot',allow: '/' },
      { userAgent: 'Googlebot',    allow: '/', disallow: ['/api/', '/eredmeny'] },
      { userAgent: 'Bingbot',      allow: '/', disallow: ['/api/', '/eredmeny'] },
    ],
    sitemap: 'https://diagnozisom.hu/sitemap.xml',
    host: 'https://diagnozisom.hu',
  }
}
