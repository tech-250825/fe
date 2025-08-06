import { generateSEOMetadata } from '@/components/seo/SEOHead';
import { Metadata } from 'next';

export function generateVideoCreationMetadata(locale: string): Metadata {
  const localizedContent = {
    ko: {
      title: 'AI 영상 생성 도구 - Hoit',
      description: '텍스트 설명만으로 전문적인 AI 영상을 생성하세요. 다양한 스타일과 캐릭터로 나만의 독특한 영상을 만들어보세요. 실시간 미리보기 지원.',
      keywords: ['AI 영상 생성기', '텍스트를 영상으로', 'AI 비디오 메이커', '영상 제작 도구', 'AI 애니메이션 생성'],
    },
    en: {
      title: 'AI Video Generator - Hoit',
      description: 'Generate professional AI videos from text descriptions. Create unique videos with various styles and characters. Real-time preview supported.',
      keywords: ['AI video generator', 'text to video', 'AI video maker', 'video creation tool', 'AI animation generator'],
    },
    ja: {
      title: 'AI動画ジェネレーター - Hoit',
      description: 'テキスト説明からプロフェッショナルなAI動画を生成します。様々なスタイルとキャラクターでユニークな動画を作成できます。リアルタイムプレビュー対応。',
      keywords: ['AI動画ジェネレーター', 'テキストから動画', 'AI動画メーカー', '動画作成ツール', 'AIアニメーション生成'],
    },
    zh: {
      title: 'AI视频生成器 - Hoit',
      description: '从文本描述生成专业的AI视频。使用各种风格和角色创建独特的视频。支持实时预览。',
      keywords: ['AI视频生成器', '文本转视频', 'AI视频制作器', '视频创作工具', 'AI动画生成器'],
    },
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.ko;

  const alternateLanguages: Record<string, string> = {};
  Object.keys(localizedContent).forEach((lang) => {
    alternateLanguages[lang] = `https://hoit.ai.kr/${lang}/create/videos`;
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