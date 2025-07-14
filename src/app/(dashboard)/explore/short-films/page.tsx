"use client";

import React from "react";
import Image from "next/image";
import { Play, Calendar, Clock, Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 영화 데이터 타입 정의
interface Film {
  id: number;
  title: string;
  director: string;
  duration: string;
  releaseDate: string;
  rating: number;
  thumbnail: string;
  genre: string;
  awards?: string[];
}

const ShortFilmsPage: React.FC = () => {
  // 단편 영화 데이터 (임시)
  const awardWinningFilms = [
    {
      id: 1,
      title: "The Last Signal",
      director: "AI Cinema Lab",
      duration: "12:45",
      releaseDate: "2024",
      rating: 4.8,
      awards: ["Best AI Film 2024", "Audience Choice"],
      thumbnail:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=338&fit=crop&q=80",
      genre: "Drama",
    },
    {
      id: 2,
      title: "Digital Dreams",
      director: "Neural Networks Studio",
      duration: "8:30",
      releaseDate: "2024",
      rating: 4.6,
      awards: ["Technical Excellence", "Best Visual Effects"],
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=338&fit=crop&q=80",
      genre: "Sci-Fi",
    },
  ];

  const recentReleases = [
    {
      id: 3,
      title: "Midnight in Tokyo",
      director: "Urban AI",
      duration: "15:20",
      releaseDate: "Jan 2025",
      rating: 4.7,
      thumbnail:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=225&fit=crop&q=80",
      genre: "Thriller",
    },
    {
      id: 4,
      title: "Ocean's Memory",
      director: "Aquatic Visions",
      duration: "10:15",
      releaseDate: "Dec 2024",
      rating: 4.5,
      thumbnail:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop&q=80",
      genre: "Documentary",
    },
    {
      id: 5,
      title: "The Time Keeper",
      director: "Temporal Studios",
      duration: "18:45",
      releaseDate: "Dec 2024",
      rating: 4.9,
      thumbnail:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=225&fit=crop&q=80",
      genre: "Fantasy",
    },
    {
      id: 6,
      title: "Neon Nights",
      director: "Cyber Vision",
      duration: "13:30",
      releaseDate: "Nov 2024",
      rating: 4.4,
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&q=80",
      genre: "Action",
    },
  ];

  const classicCollection = [
    {
      id: 7,
      title: "The First AI",
      director: "Pioneer Films",
      duration: "22:10",
      releaseDate: "2023",
      rating: 4.8,
      thumbnail:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop&q=80",
      genre: "Historical",
    },
    {
      id: 8,
      title: "Silent Symphony",
      director: "Harmony AI",
      duration: "16:25",
      releaseDate: "2023",
      rating: 4.6,
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop&q=80",
      genre: "Musical",
    },
    {
      id: 9,
      title: "Beyond the Horizon",
      director: "Infinite Studios",
      duration: "19:55",
      releaseDate: "2023",
      rating: 4.7,
      thumbnail:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop&q=80",
      genre: "Adventure",
    },
    {
      id: 10,
      title: "Quantum Hearts",
      director: "Love Algorithm",
      duration: "14:40",
      releaseDate: "2023",
      rating: 4.5,
      thumbnail:
        "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=225&fit=crop&q=80",
      genre: "Romance",
    },
  ];

  const FilmCard = ({
    film,
    featured = false,
  }: {
    film: Film;
    featured?: boolean;
  }) => (
    <Card
      className={`overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group ${featured ? "col-span-1 md:col-span-2" : ""}`}
    >
      <div className={`relative w-full ${featured ? "h-64 md:h-80" : "h-48"}`}>
        <Image
          src={film.thumbnail}
          alt={film.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-4">
            <Play className="w-10 h-10 text-black" />
          </div>
        </div>
        <div className="absolute top-4 left-4 space-y-2">
          <Badge variant="secondary" className="bg-black/70 text-white">
            {film.genre}
          </Badge>
          {film.awards && film.awards.length > 0 && (
            <Badge className="bg-yellow-500 text-black flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Award Winner</span>
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge
            variant="outline"
            className="bg-black/70 text-white border-white/30"
          >
            <Clock className="w-3 h-3 mr-1" />
            {film.duration}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3
          className={`font-bold mb-2 text-black ${featured ? "text-xl" : "text-lg"}`}
        >
          {film.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Directed by {film.director}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{film.releaseDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{film.rating}</span>
            </div>
          </div>
        </div>

        {film.awards && film.awards.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Awards:</p>
            <div className="flex flex-wrap gap-1">
              {film.awards.map((award: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" variant="outline">
          Watch Now
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-12">
      {/* Award-Winning Films */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Award className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-black">Award-Winning Films</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {awardWinningFilms.map((film) => (
            <FilmCard key={film.id} film={film} featured />
          ))}
        </div>
      </section>

      {/* Recent Releases */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">Recent Releases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentReleases.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>

      {/* Classic Collection */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">
          Classic Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classicCollection.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>

      {/* Genre Filter */}
      <section>
        <h2 className="text-2xl font-bold text-black mb-6">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            "Drama",
            "Sci-Fi",
            "Thriller",
            "Documentary",
            "Fantasy",
            "Action",
            "Historical",
            "Musical",
            "Adventure",
            "Romance",
          ].map((genre) => (
            <Card
              key={genre}
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-sm text-black">{genre}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShortFilmsPage;
