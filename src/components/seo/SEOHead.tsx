import { Metadata } from 'next';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  locale?: string;
  alternates?: {
    languages: Record<string, string>;
  };
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url,
  type = 'website',
  locale = 'ko',
  alternates
}: SEOProps): Metadata {
  const baseUrl = 'https://katin.org'; // Update with your domain
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Katin Team' }],
    creator: 'Katin',
    publisher: 'Katin',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      locale,
      url: fullUrl,
      siteName: 'Katin - AI Video Generation Platform',
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hoit_ai', // Update with your Twitter handle
      creator: '@hoit_ai',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: alternates ? {
      canonical: fullUrl,
      languages: alternates.languages,
    } : {
      canonical: fullUrl,
    },
    verification: {
      // Add when you have these
      // google: 'your-google-site-verification',
      // yandex: 'your-yandex-verification',
      // yahoo: 'your-yahoo-verification',
    },
  };

  return metadata;
}