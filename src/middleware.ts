import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 경로들은 국제화 건너뛰기
  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  if (isAdminPath) {
    // 관리자 페이지는 그대로 통과
    return NextResponse.next();
  }

  // API 경로도 건너뛰기 (혹시 모를 경우 대비)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 일반 페이지는 국제화 미들웨어 적용
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // 모든 경로를 포함하되, 정적 파일과 Next.js 내부 파일들만 제외
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
