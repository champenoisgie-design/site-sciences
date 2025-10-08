// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pages = [
    "", "panier", "cours", "faq",
    "(legal)/cgu", "(legal)/confidentialite", "(legal)/mentions",
    "parents", "compte/appareils", "prof"
  ];
  const now = new Date();
  return pages.map(p => ({
    url: `${BASE}/${p}`.replace(/\/+$/,'/'),
    lastModified: now,
    changeFrequency: "weekly",
    priority: p==="" ? 1 : 0.6
  }));
}
