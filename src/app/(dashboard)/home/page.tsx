"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

const HomePage: React.FC = () => {
  const bannerTexts = ["Create Animation", "Create Images"];
  const [currentBannerTextIndex, setCurrentBannerTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerTextIndex(
        (prevIndex) => (prevIndex + 1) % bannerTexts.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerTexts.length]);

  return (
    <div className="p-10 bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-xl overflow-hidden mb-12 shadow-2xl">
        <video
          src="https://hoit-landingpage.han1000llm.workers.dev/landingpage_video/naruto.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <h2 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {bannerTexts[currentBannerTextIndex]}
          </h2>
        </div>
      </section>

      {/* Video Grid */}
      <section>
        <h3 className="text-3xl font-bold mb-8 text-black">
          Explore Animations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group border border-gray-200"
            >
              <div className="relative w-full h-48">
                <Image
                  src={`https://images.unsplash.com/photo-1611162617213-6d221bde6760?w=400&h=225&fit=crop&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format`}
                  alt={`Video Thumbnail ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-xl mb-2 text-black">
                  Awesome Animation {index + 1}
                </h4>
                <p className="text-sm text-gray-600">AI Generated • 2:30</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
