"use client";

import React from "react";
import Image from "next/image";
import { Play, Heart, Share2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 비디오 데이터 타입 정의
interface Video {
  id: number;
  title: string;
  creator: string;
  duration: string;
  views: string;
  likes: string;
  thumbnail: string;
  category: string;
  featured?: boolean;
}

const RecommendationsPage: React.FC = () => {
  // 추천 영상 데이터 (임시)
  const featuredVideos = [
    {
      id: 1,
      title: "Epic Fantasy Adventure",
      creator: "AI Studio Pro",
      duration: "3:45",
      views: "125K",
      likes: "8.2K",
      thumbnail:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=338&fit=crop&q=80",
      category: "Fantasy",
      featured: true,
    },
    {
      id: 2,
      title: "Cyberpunk Night City",
      creator: "Neon Dreams",
      duration: "2:30",
      views: "89K",
      likes: "5.7K",
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=338&fit=crop&q=80",
      category: "Sci-Fi",
      featured: true,
    },
  ];

  const recommendedVideos = [
    {
      id: 3,
      title: "Mystical Forest Journey",
      creator: "Nature AI",
      duration: "4:12",
      views: "67K",
      likes: "4.1K",
      thumbnail:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop&q=80",
      category: "Nature",
    },
    {
      id: 4,
      title: "Space Odyssey 2024",
      creator: "Cosmic Visions",
      duration: "5:23",
      views: "156K",
      likes: "12.3K",
      thumbnail:
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=225&fit=crop&q=80",
      category: "Space",
    },
    {
      id: 5,
      title: "Ancient Civilization",
      creator: "History AI",
      duration: "3:18",
      views: "43K",
      likes: "2.8K",
      thumbnail:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d4d795?w=400&h=225&fit=crop&q=80",
      category: "Historical",
    },
    {
      id: 6,
      title: "Ocean Depths",
      creator: "Aqua Studios",
      duration: "2:45",
      views: "78K",
      likes: "6.2K",
      thumbnail:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop&q=80",
      category: "Nature",
    },
    {
      id: 7,
      title: "Robot Uprising",
      creator: "Mech Vision",
      duration: "4:01",
      views: "198K",
      likes: "15.7K",
      thumbnail:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop&q=80",
      category: "Sci-Fi",
    },
    {
      id: 8,
      title: "Magical Kingdom",
      creator: "Fantasy Realm",
      duration: "3:33",
      views: "92K",
      likes: "7.4K",
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&q=80",
      category: "Fantasy",
    },
  ];

  const VideoCard = ({
    video,
    featured = false,
  }: {
    video: Video;
    featured?: boolean;
  }) => (
    <Card
      className={`overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group ${featured ? "col-span-1 md:col-span-2" : ""}`}
    >
      <div className={`relative w-full ${featured ? "h-64 md:h-80" : "h-48"}`}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-3">
            <Play className="w-8 h-8 text-black" />
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {video.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge
            variant="outline"
            className="bg-black/70 text-white border-white/30"
          >
            {video.duration}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3
          className={`font-bold mb-2 text-black ${featured ? "text-xl" : "text-lg"}`}
        >
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">by {video.creator}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{video.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{video.likes}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-12">
      {/* Featured Section */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">Featured Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredVideos.map((video) => (
            <VideoCard key={video.id} video={video} featured />
          ))}
        </div>
      </section>

      {/* Recommended Section */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            "Fantasy",
            "Sci-Fi",
            "Nature",
            "Space",
            "Historical",
            "Adventure",
          ].map((category) => (
            <Card
              key={category}
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg text-black">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RecommendationsPage;
