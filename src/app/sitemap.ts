import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://ton-domaine.fr'
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/tutoriels`, lastModified: new Date() },
    { url: `${base}/solo`, lastModified: new Date() },
  ]
}
