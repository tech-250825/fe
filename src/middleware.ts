import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 정적 파일들은 모두 제외하고 페이지 라우팅만 처리
  matcher: [
    // Include all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
