import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: [ "en", "ja", "zh"],
  defaultLocale: "en",
});

// Navigation APIs 생성 (최신 방식)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

// 타입 정의 (TypeScript 사용 시)
export type Locale = (typeof routing.locales)[number];
