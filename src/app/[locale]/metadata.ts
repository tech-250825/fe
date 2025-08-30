import { generateSEOMetadata } from '@/components/seo/SEOHead';

export function generateLandingPageMetadata(locale: string) {
  const localizedContent = {
    en: {
      title: 'Katin - Create Stunning AI Videos from Text',
      description: 'Create professional AI-powered videos from simple text descriptions. Advanced video generation with multiple styles, HD quality, and real-time preview. Try Katin for free today.',
      keywords: ['AI video generation', 'text to video', 'AI video creator', 'video generation AI', 'automated video creation', 'AI animation', 'video maker'],
    },
    ja: {
      title: 'Katin - テキストからAI動画を生成',
      description: 'シンプルなテキスト説明から、プロ品質のAI動画を作成できます。複数のスタイル、Katin画質、リアルタイムプレビューで高度な動画生成を体験してください。',
      keywords: ['AI動画生成', 'テキストから動画', 'AI動画クリエーター', '動画生成AI', '自動動画作成', 'AIアニメーション', '動画メーカー'],
    },
    zh: {
      title: 'Katin - 从文本创建精美的AI视频',
      description: '通过简单的文本描述创建专业的AI驱动视频。具有多种风格、高清质量和实时预览的先进视频生成功能。立即免费试用Katin。',
      keywords: ['AI视频生成', '文本转视频', 'AI视频创建器', '视频生成AI', '自动视频创作', 'AI动画', '视频制作器'],
    },
  };

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.en;

  const alternateLanguages: Record<string, string> = {};
  Object.keys(localizedContent).forEach((lang) => {
    alternateLanguages[lang] = `https://katin.org/${lang}`;
  });

  return generateSEOMetadata({
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    url: `/${locale}`,
    locale,
    alternates: {
      languages: alternateLanguages,
    },
  });
}