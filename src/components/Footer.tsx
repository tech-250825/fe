"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  Youtube,
  ArrowRight
} from "lucide-react";

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
  </svg>
);

export default function Footer() {
  // Remove translations for now since they're not defined
  // const t = useTranslations("Footer");
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">Hoit</div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transform your ideas into stunning AI-powered animations. Create professional videos 
              and images with our cutting-edge artificial intelligence platform.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/han1000llm" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/hpmPdaysuR" className="text-gray-400 hover:text-white transition-colors">
                <DiscordIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/hoitstudio/" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@HoitStudio-h8g" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>


          {/* <div>
            <h4 className="text-white font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              <li><a href="/create/videos" className="text-gray-400 hover:text-white transition-colors">Video Generation</a></li>
              <li><a href="/create/images" className="text-gray-400 hover:text-white transition-colors">Image Creation</a></li>
              <li><a href="/create/builder" className="text-gray-400 hover:text-white transition-colors">Animation Builder</a></li>
              <li><a href="/library" className="text-gray-400 hover:text-white transition-colors">Asset Library</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/api" className="text-gray-400 hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="/community" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/changelog" className="text-gray-400 hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div> */}

          {/* Company Information */}
          <div>
            <h4 className="text-white font-semibold mb-6">회사 정보</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">대표: </span>
                <span className="text-white">김민재</span>
              </div>
              <div>
                <span className="text-gray-400">사업자등록번호: </span>
                <span className="text-white">109-43-51540</span>
              </div>
              <div>
                <span className="text-gray-400">개인정보책임자: </span>
                <span className="text-white">김민재</span>
              </div>
              <div>
                <span className="text-gray-400">호스팅 서비스: </span>
                <span className="text-white">호잇 스튜디오</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h5 className="text-white font-semibold mb-4">연락처</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:han1000llm@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                    han1000llm@gmail.com
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span className="text-gray-400">
                    서울시 성북구 동소문로 63<br />
                    드림트리 빌딩
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Hoit, Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                개인정보 처리방침
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                서비스 이용약관
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                문의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}