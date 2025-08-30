import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Metadata } from 'next';

export function generateHomePageMetadata(locale: string): Metadata {
  const localizedContent = {
    en: {
      title: 'AI Video Dashboard - Katin',
      description: 'Explore the latest AI-generated videos and get inspired. Browse community-created videos in various styles and create your own masterpiece.',
      keywords: ['AI video gallery', 'video dashboard', 'AI video examples', 'video inspiration', 'AI artwork collection'],
    },
    ja: {
      title: 'AI動画ダッシュボード - Katin',
      description: '最新のAI生成動画を探索し、インスピレーションを得ましょう。コミュニティが作成した様々なスタイルの動画を閲覧し、自分だけの作品を作成してください。',
      keywords: ['AI動画ギャラリー', '動画ダッシュボード', 'AI動画例', '動画インスピレーション', 'AI作品コレクション'],
    },
    zh: {
      title: 'AI视频仪表板 - Katin',
      description: '浏览最新的AI生成视频并获得灵感。查看社区创建的各种风格视频，创作属于你自己的杰作。',
      keywords: ['AI视频画廊', '视频仪表板', 'AI视频示例', '视频灵感', 'AI作品集合'],
    },
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.en;

  const alternateLanguages: Record<string, string> = {};
  Object.keys(localizedContent).forEach((lang) => {
    alternateLanguages[lang] = `https://katin.org/${lang}/home`;
  });

  return generateSEOMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    url: `/${locale}/home`,
    locale,
    alternates: {
      languages: alternateLanguages,
    },
  });
}