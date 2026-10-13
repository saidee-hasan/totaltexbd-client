import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalapparel.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Only private API endpoints are disallowed. `/_next/` must remain
      // crawlable so Googlebot can render pages with their CSS and JS.
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
