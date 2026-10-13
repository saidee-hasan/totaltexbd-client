import type { MetadataRoute } from 'next';
import { getApiBase, NewsRecord, ProductRecord } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalapparel.com';

  const staticRoutes = [
    '',
    '/about',
    '/capabilities',
    '/collection',
    '/contact',
    '/kids',
    '/lookbook',
    '/men',
    '/news',
    '/privacy',
    '/process',
    '/products',
    '/terms',
    '/women'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const newsRes = await fetch(`${getApiBase()}/api/news`, { next: { revalidate: 60 } });
    if (newsRes.ok) {
      const data = await newsRes.json();
      const items = data?.data?.items ?? data?.data ?? [];
      if (Array.isArray(items)) {
        items.forEach((item: NewsRecord) => {
          staticRoutes.push({
            url: `${baseUrl}/news/${item._id}`,
            lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          });
        });
      }
    }

    const prodRes = await fetch(`${getApiBase()}/api/products`, { next: { revalidate: 60 } });
    if (prodRes.ok) {
      const data = await prodRes.json();
      // The products endpoint returns { products, total, categories }.
      const items = data?.data?.products ?? data?.data?.items ?? (Array.isArray(data?.data) ? data.data : []);
      if (Array.isArray(items)) {
        items.forEach((item: ProductRecord) => {
          staticRoutes.push({
            url: `${baseUrl}/products/${item._id}`,
            lastModified: item.createdAt ? new Date(item.createdAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          });
        });
      }
    }
  } catch (err) {
    console.error('Failed to fetch dynamic routes for sitemap', err);
  }

  return staticRoutes;
}
