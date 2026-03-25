import { MetadataRoute } from 'next'

const BASE_URL = 'https://diagnozisom.hu'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  return [
    { url: BASE_URL,                                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,                               lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/blog/verekep-ertelmezese`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/partnerek`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/adatvedelem`,                        lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
  ]
}
