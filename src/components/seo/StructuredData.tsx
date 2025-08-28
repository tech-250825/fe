'use client';

import { useLocale } from 'next-intl';

interface StructuredDataProps {
  type: 'WebSite' | 'WebApplication' | 'Organization' | 'VideoObject' | 'BreadcrumbList';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const locale = useLocale();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Predefined structured data generators
export const generateWebSiteSchema = (locale: string) => ({
  name: 'Hoit',
  alternateName: 'Hoit AI Video Generator',
  url: 'https://hoit.ai.kr',
  description: 'Create stunning AI-powered videos from text descriptions. Advanced video generation with multiple styles and formats.',
  inLanguage: locale,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://hoit.ai.kr/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateWebApplicationSchema = (locale: string) => ({
  name: 'Hoit AI Video Generator',
  url: 'https://hoit.ai.kr',
  description: 'Advanced AI video generation platform for creating videos from text descriptions',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  permissions: 'No special permissions required',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    category: 'Free with premium options',
  },
  featureList: [
    'Text-to-video generation',
    'Multiple video styles',
    'HD video output',
    'Multi-language support',
    'Real-time preview',
  ],
  screenshot: 'https://hoit.ai.kr/screenshots/dashboard.jpg',
  softwareVersion: '1.0',
  inLanguage: locale,
});

export const generateOrganizationSchema = () => ({
  name: 'Hoit',
  url: 'https://hoit.ai.kr',
  logo: 'https://hoit.ai.kr/logo.png',
  description: 'Leading AI video generation platform',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@hoit.studio',
    contactType: 'Customer Service',
    availableLanguage: ['Korean', 'English', 'Japanese', 'Chinese'],
  },
  sameAs: [
    'https://t.me/+r0oBvmb0rb43ZTVl',
    'https://instagram.com/hoit.studio',
  ],
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});