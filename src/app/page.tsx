"use client";

import React, { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";

const MinimalistLandingPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="absolute top-0 w-full z-30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-white">
            Hoit
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-gray-300">
            <a href="#" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-white transition-colors">
              API
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Log In
            </a>
            <a
              href="/home"
              className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center"
            >
              Try for Free <ArrowRight className="w-4 h-4 ml-2" />
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
          src="https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/UpscaleVideo_1_20250711.mp4"
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <main className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
            Create Animation with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Imagine it, describe it, create it. Hoit generates high-quality
            video from text prompts, bringing your ideas to life in seconds.
          </p>
          <div className="max-w-2xl w-full mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                placeholder="A cinematic shot of a baby raccoon wearing a tiny cowboy hat..."
                className="w-full bg-white/20 backdrop-blur-sm border border-gray-500 rounded-full pl-14 pr-4 py-4 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:outline-none transition-colors"
              />
            </div>
            <p className="text-sm text-gray-300 mt-3">
              No credit card required. Start creating videos instantly.
            </p>
          </div>
        </main>
      </div>
      {/* Animation Showcase Section */}
      <section className="py-20 px-6 bg-white text-black">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 tracking-tighter">
            Animation Showcase
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => {
              const videoUrls = [
                "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/ghibli_upscale.mp4",
                "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/violet_upscale.mp4",
                "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/pastel_upscale.mp4",
                "https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/ship_upscale.mp4",
              ];

              const thumbnailPaths = [
                "/thumbnails/ghibli_thumbnail.png",
                "/thumbnails/violet_thumbnail.png",
                "/thumbnails/pastel_thumbnail.png",
                "/thumbnails/ship_thumbnail.png",
              ];

              const titles = [
                "Ghibli Style Animation",
                "Violet Character Animation",
                "Pastel Art Animation",
                "Vintage Style Animation",
              ];

              return (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedVideo(videoUrls[index])}
                >
                  <div className="relative rounded-lg overflow-hidden aspect-w-16 aspect-h-9 bg-gray-200">
                    <Image
                      src={thumbnailPaths[index]}
                      alt={titles[index]}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={index < 2} // 첫 2개 이미지는 우선 로딩
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all" />
                    </div>
                  </div>
                  <div className="mt-4 text-left">
                    <h3 className="font-semibold text-lg">{titles[index]}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      AI Generated Animation
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white text-4xl"
            >
              &times;
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
      {/* How It Works Section */}
      <section className="py-28 px-6 bg-gray-50 text-black">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-20 tracking-tighter">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-16 text-left max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center bg-black text-white rounded-full w-20 h-20 mb-8">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">
                Send Your Character
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Upload an image or provide a detailed description of your
                character. The more detail, the better the result.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center bg-black text-white rounded-full w-20 h-20 mb-8">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">AI Magic Happens</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our AI gets to work, analyzing your input and animating your
                character in your desired style.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center bg-black text-white rounded-full w-20 h-20 mb-8">
                <Download className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Receive The Video</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                In just a few moments, you&apos;ll receive a high-quality,
                ready-to-use animation of your character.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="py-28 px-6 bg-white text-black">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-20 tracking-tighter">
            Why Choose Our AI Animation?
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <div className="group bg-gray-50 p-10 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <UserPlus className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Custom Characters</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Bring your unique creations to life. Our AI can animate any
                character you can imagine or draw.
              </p>
            </div>
            <div className="group bg-gray-50 p-10 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <Zap className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Easy Process</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                No complex software or animation skills required. Just upload
                your character and let our AI do the heavy lifting.
              </p>
            </div>
            <div className="group bg-gray-50 p-10 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <Layers className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">Multiple Styles</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Choose from a wide range of animation styles to perfectly match
                your character&apos;s personality and your vision.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Ready to Animate Section */}
      <section className="py-28 px-6 bg-gray-50 text-black">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <h2 className="text-5xl font-bold mb-6 tracking-tighter">
            Ready to Animate?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Send us your character and style and let&apos;s bring it into AI
            animation.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <a
              href="mailto:contact@hoit.studio"
              className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              Get In Touch
            </a>
            <div className="text-center pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:contact@hoit.studio"
                    className="font-semibold text-black hover:underline"
                  >
                    contact@hoit.studio
                  </a>
                </p>
                <button
                  onClick={() => copyToClipboard("contact@hoit.studio")}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">
                  Instagram:{" "}
                  <a
                    href="https://instagram.com/hoit.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-black hover:underline"
                  >
                    @hoit.studio
                  </a>
                </p>
                <button
                  onClick={() => copyToClipboard("@hoit.studio")}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tighter">
            Ready to Start Creating?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Explore the future of video creation. Sign up now and get access to
            our full suite of AI-powered tools.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors text-lg">
            Sign Up for Free
          </button>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Hoit, Inc. All rights reserved.
          </div>
          <div className="flex space-x-6 text-gray-600">
            <a href="#" className="hover:text-black">
              Twitter
            </a>
            <a href="#" className="hover:text-black">
              Discord
            </a>
            <a href="#" className="hover:text-black">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinimalistLandingPage;
