// src/app/[locale]/layout.tsx   (파일 위치는 그대로)
// ※ Next 14 기준, params 는 Promise 가 아니라 바로 객체입니다.

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Promise 추가
}) {
  const { locale } = await params; // await 추가
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    // html / body 제거 → Fragment 로 감싸거나 div 등 원하는 컨테이너 사용
    <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
  );
}
