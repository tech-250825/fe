import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Metadata } from 'next';

export function generateHomePageMetadata(locale: string): Metadata {
  const localizedContent = {
    ko: {
      title: 'AI 영상 대시보드 - Katin',
      description: '최신 AI 생성 영상들을 둘러보고 영감을 얻으세요. 커뮤니티에서 만든 다양한 스타일의 AI 영상을 확인하고 나만의 영상을 만들어보세요.',
      keywords: ['AI 영상 갤러리', '영상 대시보드', 'AI 영상 예제', '영상 영감', 'AI 작품 모음'],
    },
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

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.ko;

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