"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ImageIcon,
  Search,
  Menu,
  Play,
  Upload,
  Sparkles,
  Download,
  UserPlus,
  Zap,
  Layers,
  Copy,
  User,
  LogOut,
  Edit3,
  Images,
  Film
} from "lucide-react";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { StructuredData, generateWebSiteSchema, generateWebApplicationSchema, generateOrganizationSchema } from "@/components/seo/StructuredData";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

// 추가
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react"; // (Images, Film, Edit3는 이미 가져왔으니 OK)

const FadeIn: React.FC<React.PropsWithChildren<{ delay?: number }>> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);



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

const MinimalistLandingPage: React.FC = () => {

  const t = useTranslations("LandingPage");
  const locale = useLocale();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="font-sans">
      {/* Structured Data for SEO */}
      <StructuredData type="WebSite" data={generateWebSiteSchema(locale)} />
      <StructuredData type="WebApplication" data={generateWebApplicationSchema(locale)} />
      <StructuredData type="Organization" data={generateOrganizationSchema()} />
      {/* Header */}
      <header className="absolute top-0 w-full z-30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-white">
            Katin
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-gray-300">
          </nav>
          <div className="flex items-center space-x-4">
            <LocaleSwitcher />
            {/* Discord Button */}
            <a
              href="https://t.me/+r0oBvmb0rb43ZTVl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gray-200 inline-block"
              title="Join Discord"
            >
              <DiscordIcon className="w-5 h-5" />
            </a>
            <a
              href="/home"
              className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center"
            >
              {t("nav.tryForFree")} <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          <div className="md:hidden">
            <Menu className="text-white" />
          </div>
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <div className="relative h-screen overflow-hidden">
        <video
          src="/hero/output2.mp4"
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <main className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            {t("hero.description")}
          </p>
          <div className="flex justify-center">
            <a 
              href="/create/videos"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full hover:bg-white/20 transition-colors flex items-center text-lg font-medium"
            >
              Create Katin Animation <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </main>
      </div>
      

      {/* FEATURES */}
      {/* <div id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <FadeIn>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">핵심 기능</h2>
            <p className="mt-3 text-white/70 max-w-2xl">세 가지 축으로 흐름을 단순화했습니다. 만들고, 이어가고, 다듬는 것.</p>
          </FadeIn>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5" data-testid="feature-grid">
            {[
              {
                icon: Images,
                title: "일러스트 만들기",
                desc: "손맛이 느껴지는 결과물. 복잡한 설정은 배경으로 숨겼습니다.",
                badge: "Illustration",
              },
              {
                icon: Film,
                title: "일관성 애니메이션",
                desc: "캐릭터의 분위기를 잃지 않고 장면을 이어 붙입니다.",
                badge: "Consistent Animation",
              },
              {
                icon: Edit3,
                title: "이미지 편집",
                desc: "브러시, 마스크, 디테일 보정까지 자연스럽게.",
                badge: "Edit Suite",
              },
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <Card className="rounded-2xl border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors" data-testid={`feature-card-${idx}`}>
                  <CardHeader>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                      <item.icon className="h-4 w-4" />
                      {item.badge}
                    </div>
                    <CardTitle className="mt-4 text-lg md:text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm md:text-base">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    
      <div id="research" className="py-14">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-2 items-start">
            <div>
              <h3 className="text-2xl font-semibold">Research</h3>
              <p className="mt-2 text-white/70">일관성과 컨트롤을 위한 모델 연구. 새 릴리즈 노트와 데모를 소개합니다.</p>
              <a href="#" className="mt-4 inline-flex items-center text-white/90 hover:underline">최근 리서치 보기 <ArrowRight className="ml-2 h-4 w-4"/></a>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1400&auto=format&fit=crop" alt="research" className="h-64 w-full object-cover"/>
            </div>
          </div>
        </div>
      </div>

    
      <div id="gallery" className="py-12">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h3 className="text-xl md:text-3xl font-semibold">작품 프리뷰</h3>
                <p className="mt-2 text-white/70">호버하면 미리보기가 재생되거나 확대됩니다.</p>
              </div>
              <Button variant="secondary" className="rounded-xl bg-white/10 hover:bg-white/20">모두 보기</Button>
            </div>
          </FadeIn>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="gallery-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.a key={i} href="#" className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.03 }}
              whileHover={{ scale: 1.02 }} data-testid={`gallery-item-${i}`}>
              <img
                src={`https://picsum.photos/seed/${i + 30}/800/1000`}
                alt={`preview-${i}`}
                className="h-48 md:h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.a>
          ))}
          </div>
        </div>
      </div> */}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MinimalistLandingPage;
