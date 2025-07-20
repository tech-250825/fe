import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // 빌드 시 ESLint 완전 비활성화
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 에러도 무시 (선택사항)
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
