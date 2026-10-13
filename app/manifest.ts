import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Total Apparel',
    short_name: 'Total Apparel',
    description: 'Precision Garment Manufacturing',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0F172A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
