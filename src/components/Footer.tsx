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

// Telegram Icon Component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
            <div className="text-2xl font-bold text-white mb-4">Katin</div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transform your ideas into stunning AI-powered animations. Create professional videos 
              and images with our cutting-edge artificial intelligence platform.
            </p>
            <div className="flex space-x-4">
              {/* <a href="https://x.com/han1000llm" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a> */}
              <a href="https://t.me/+r0oBvmb0rb43ZTVl" className="text-gray-400 hover:text-white transition-colors">
                <TelegramIcon className="w-5 h-5" />
              </a>
              {/* <a href="https://www.instagram.com/hoitstudio/" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@HoitStudio-h8g" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a> */}
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Katin, Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Service Term
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}