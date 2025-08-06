import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hoit.ai.kr';
  const currentDate = new Date();

  // Define supported locales
  const locales = ['ko', 'en', 'ja', 'zh'];
  
  // Define routes with their priorities and change frequencies
  const routes = [
    {
      url: '',
      priority: 1.0,
      changeFrequency: 'daily' as const,
    },
    {
      url: '/home',
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
    {
      url: '/create/videos',
      priority: 0.9,
      changeFrequency: 'weekly' as const,
    },
    {
      url: '/create/images',
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      url: '/library',
      priority: 0.7,
      changeFrequency: 'daily' as const,
    },
    {
      url: '/boards',
      priority: 0.7,
      changeFrequency: 'daily' as const,
    },
    {
      url: '/profile',
      priority: 0.5,
      changeFrequency: 'weekly' as const,
    },
    {
      url: '/login',
      priority: 0.4,
      changeFrequency: 'monthly' as const,
    },
  ];

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      const url = route.url === '' 
        ? `${baseUrl}/${locale}`
        : `${baseUrl}/${locale}${route.url}`;

      sitemapEntries.push({
        url,
        lastModified: currentDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  return sitemapEntries;
}