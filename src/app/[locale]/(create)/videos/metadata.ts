import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Metadata } from 'next';

export function generateVideoCreationMetadata(locale: string): Metadata {
  const localizedContent = {
    en: {
      title: 'AI Video Generator - Katin',
      description: 'Generate professional AI videos from text descriptions. Create unique videos with various styles and characters. Real-time preview supported.',
      keywords: ['AI video generator', 'text to video', 'AI video maker', 'video creation tool', 'AI animation generator'],
    },
    ja: {
      title: 'AI動画ジェネレーター - Katin',
      description: 'テキスト説明からプロフェッショナルなAI動画を生成します。様々なスタイルとキャラクターでユニークな動画を作成できます。リアルタイムプレビュー対応。',
      keywords: ['AI動画ジェネレーター', 'テキストから動画', 'AI動画メーカー', '動画作成ツール', 'AIアニメーション生成'],
    },
    zh: {
      title: 'AI视频生成器 - Katin',
      description: '从文本描述生成专业的AI视频。使用各种风格和角色创建独特的视频。支持实时预览。',
      keywords: ['AI视频生成器', '文本转视频', 'AI视频制作器', '视频创作工具', 'AI动画生成器'],
    },
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.en;

  const alternateLanguages: Record<string, string> = {};
  Object.keys(localizedContent).forEach((lang) => {
    alternateLanguages[lang] = `https://katin.org/${lang}/create/videos`;
  });

  return generateSEOMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    url: `/${locale}/create/videos`,
    locale,
    alternates: {
      languages: alternateLanguages,
    },
  });
}