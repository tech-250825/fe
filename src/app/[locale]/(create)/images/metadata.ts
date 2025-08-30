import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Metadata } from 'next';

export function generateImageCreationMetadata(locale: string): Metadata {
  const localizedContent = {
    en: {
      title: 'AI Image Generator - Katin',
      description: 'Generate stunning AI images from text descriptions. Create high-resolution images with various art styles. Start for free today.',
      keywords: ['AI image generator', 'text to image', 'AI art generator', 'image creation tool', 'AI artwork generator'],
    },
    ja: {
      title: 'AI画像ジェネレーター - Katin',
      description: 'テキスト説明から美しいAI画像を生成します。様々なアートスタイルで高解像度画像を作成できます。今すぐ無料で始めましょう。',
      keywords: ['AI画像ジェネレーター', 'テキストから画像', 'AIアート生成', '画像作成ツール', 'AI絵画生成'],
    },
    zh: {
      title: 'AI图像生成器 - Katin',
      description: '从文本描述生成惊人的AI图像。使用各种艺术风格创建高分辨率图像。立即免费开始。',
      keywords: ['AI图像生成器', '文本转图像', 'AI艺术生成器', '图像创作工具', 'AI艺术品生成器'],
    },
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.ko;

  const alternateLanguages: Record<string, string> = {};
  Object.keys(localizedContent).forEach((lang) => {
    alternateLanguages[lang] = `https://katin.org/${lang}/create/images`;
  });

  return generateSEOMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    url: `/${locale}/create/images`,
    locale,
    alternates: {
      languages: alternateLanguages,
    },
  });
}