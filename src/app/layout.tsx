import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
// import { SSEProvider } from "@/components/SSEProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Hoit - AI Video Generation Platform',
    default: 'Hoit - Create Stunning AI Videos from Text'
  },
  description: "Create professional AI-powered videos from simple text descriptions. Advanced video generation with multiple styles, HD quality, and real-time preview. Try Hoit for free today.",
  keywords: ["AI video generation", "text to video", "AI video creator", "video generation AI", "automated video creation", "AI animation", "video maker"],
  authors: [{ name: "Hoit Team" }],
  creator: "Hoit",
  publisher: "Hoit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hoit.ai.kr'),
  alternates: {
    canonical: 'https://hoit.ai.kr',
    languages: {
      'ko': 'https://hoit.ai.kr/ko',
      'en': 'https://hoit.ai.kr/en',
      'ja': 'https://hoit.ai.kr/ja',
      'zh': 'https://hoit.ai.kr/zh',
    },
  },
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
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hoit.ai.kr',
    siteName: 'Hoit - AI Video Generation Platform',
    title: 'Hoit - Create Stunning AI Videos from Text',
    description: 'Create professional AI-powered videos from simple text descriptions. Advanced video generation with multiple styles and HD quality.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hoit AI Video Generation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hoit_ai',
    creator: '@hoit_ai',
    title: 'Hoit - Create Stunning AI Videos from Text',
    description: 'Create professional AI-powered videos from simple text descriptions. Advanced video generation platform.',
    images: ['/og-image.jpg'],
  },
  verification: {
    // Add when you get these verification codes
    // google: 'your-google-site-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
