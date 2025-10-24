"use client";

import { useState, useRef } from "react";
import { NewsArticle } from "../types";
import NewsReelCard from "./NewsReelCard";

interface NewsReelProps {
  articles: NewsArticle[];
}

export default function NewsReel({ articles }: NewsReelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  // Simple touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && currentIndex < articles.length - 1) {
        // Swiped up - next article
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swiped down - previous article
        setCurrentIndex((prev) => prev - 1);
      }
    }

    setIsDragging(false);
  };

  // Wheel scroll for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 10) {
      if (e.deltaY > 0 && currentIndex < articles.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No articles available</p>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full bg-black overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Articles container with simple transform */}
      <div
        className="h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {articles.map((article, index) => (
          <div key={article.id || index} className="h-screen w-full">
            <NewsReelCard article={article} />
          </div>
        ))}
      </div>

      {/* Simple navigation hints */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        {currentIndex < articles.length - 1 && (
          <div className="text-white text-sm opacity-70">
            ↑ Swipe up for next
          </div>
        )}
      </div>
    </div>
  );
}
