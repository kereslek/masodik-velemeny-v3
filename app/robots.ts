import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/eredmeny'],
      },
      // Explicitly allow major AI crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/eredmeny'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/eredmeny'],
      },
    ],
    sitemap: 'https://masodikvelemeny.hu/sitemap.xml',
    host: 'https://masodikvelemeny.hu',
  }
}
