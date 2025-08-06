import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Metadata } from 'next';

export function generateImageCreationMetadata(locale: string): Metadata {
  const localizedContent = {
    ko: {
      title: 'AI 이미지 생성 도구 - Hoit',
      description: '텍스트 설명으로 놀라운 AI 이미지를 생성하세요. 다양한 아트 스타일과 고해상도 이미지 생성이 가능합니다. 무료로 시작해보세요.',
      keywords: ['AI 이미지 생성기', '텍스트를 이미지로', 'AI 아트 생성', '이미지 제작 도구', 'AI 그림 생성'],
    },
    en: {
      title: 'AI Image Generator - Hoit',
      description: 'Generate stunning AI images from text descriptions. Create high-resolution images with various art styles. Start for free today.',
      keywords: ['AI image generator', 'text to image', 'AI art generator', 'image creation tool', 'AI artwork generator'],
    },
    ja: {
      title: 'AI画像ジェネレーター - Hoit',
      description: 'テキスト説明から美しいAI画像を生成します。様々なアートスタイルで高解像度画像を作成できます。今すぐ無料で始めましょう。',
      keywords: ['AI画像ジェネレーター', 'テキストから画像', 'AIアート生成', '画像作成ツール', 'AI絵画生成'],
    },
    zh: {
      title: 'AI图像生成器 - Hoit',
      description: '从文本描述生成惊人的AI图像。使用各种艺术风格创建高分辨率图像。立即免费开始。',
      keywords: ['AI图像生成器', '文本转图像', 'AI艺术生成器', '图像创作工具', 'AI艺术品生成器'],
    },
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.ko;

  const alternateLanguages: Record<string, string> = {};
  Object.keys(localizedContent).forEach((lang) => {
    alternateLanguages[lang] = `https://hoit.ai.kr/${lang}/create/images`;
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