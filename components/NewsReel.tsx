"use client";

import { useState, useRef } from "react";
import { NewsArticle } from "../types";
import NewsReelCard from "./NewsReelCard";

interface NewsReelProps {
  articles: NewsArticle[];
}

export default function NewsReel({ articles }: NewsReelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startTranslate = useRef(0);

  // Touch handlers for true finger following
  const handleTouchStart = (e: React.TouchEvent) => {
    const clientY = e.touches[0].clientY;
    startY.current = clientY;
    startTranslate.current = -currentIndex * window.innerHeight;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const clientY = e.touches[0].clientY;
    const deltaY = clientY - startY.current; // Fixed direction

    // Calculate new translate position (follows finger exactly)
    const newTranslate = startTranslate.current + deltaY;

    // Limit dragging bounds
    const maxTranslate = 0;
    const minTranslate = -(articles.length - 1) * window.innerHeight;

    if (newTranslate > maxTranslate) {
      setTranslateY(maxTranslate);
    } else if (newTranslate < minTranslate) {
      setTranslateY(minTranslate);
    } else {
      setTranslateY(newTranslate);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    const clientY = e.changedTouches[0].clientY;
    const deltaY = clientY - startY.current; // Fixed direction
    const deltaPercent = Math.abs(deltaY) / window.innerHeight;

    // Determine if we should snap to next/previous card
    if (deltaPercent > 0.15) {
      // 15% threshold
      if (deltaY > 0 && currentIndex > 0) {
        // Swiped DOWN - go to PREVIOUS
        setCurrentIndex((prev) => prev - 1);
        setTranslateY(-(currentIndex - 1) * window.innerHeight);
      } else if (deltaY < 0 && currentIndex < articles.length - 1) {
        // Swiped UP - go to NEXT
        setCurrentIndex((prev) => prev + 1);
        setTranslateY(-(currentIndex + 1) * window.innerHeight);
      } else {
        // Not enough swipe or at boundary - snap back
        setTranslateY(-currentIndex * window.innerHeight);
      }
    } else {
      // Not enough swipe distance - snap back to current
      setTranslateY(-currentIndex * window.innerHeight);
    }
  };

  // Mouse event handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const clientY = e.clientY;
    startY.current = clientY;
    startTranslate.current = -currentIndex * window.innerHeight;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const clientY = e.clientY;
    const deltaY = clientY - startY.current;

    const newTranslate = startTranslate.current + deltaY;
    const maxTranslate = 0;
    const minTranslate = -(articles.length - 1) * window.innerHeight;

    if (newTranslate > maxTranslate) {
      setTranslateY(maxTranslate);
    } else if (newTranslate < minTranslate) {
      setTranslateY(minTranslate);
    } else {
      setTranslateY(newTranslate);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    const clientY = e.clientY;
    const deltaY = clientY - startY.current;
    const deltaPercent = Math.abs(deltaY) / window.innerHeight;

    if (deltaPercent > 0.15) {
      if (deltaY > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setTranslateY(-(currentIndex - 1) * window.innerHeight);
      } else if (deltaY < 0 && currentIndex < articles.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setTranslateY(-(currentIndex + 1) * window.innerHeight);
      } else {
        setTranslateY(-currentIndex * window.innerHeight);
      }
    } else {
      setTranslateY(-currentIndex * window.innerHeight);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setTranslateY(-currentIndex * window.innerHeight);
    }
  };

  // Wheel scrolling for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 5) {
      if (e.deltaY > 0 && currentIndex < articles.length - 1) {
        // Wheel down - go to next
        setCurrentIndex((prev) => prev + 1);
        setTranslateY(-(currentIndex + 1) * window.innerHeight);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Wheel up - go to previous
        setCurrentIndex((prev) => prev - 1);
        setTranslateY(-(currentIndex - 1) * window.innerHeight);
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
      ref={containerRef}
      className="h-screen w-full bg-black overflow-hidden relative select-none touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    >
      {/* Articles container - follows finger during drag, animates after */}
      <div
        className="h-full"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {articles.map((article, index) => (
          <div key={article.id || index} className="h-screen w-full">
            <NewsReelCard article={article} />
          </div>
        ))}
      </div>

      {/* Navigation Hints */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        {currentIndex < articles.length - 1 && (
          <div className="text-white text-sm opacity-70 bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
            ↑ Swipe up for next
          </div>
        )}
        {currentIndex === articles.length - 1 && (
          <div className="text-white text-sm opacity-70 bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
            🎉 You're all caught up!
          </div>
        )}
      </div>

      {currentIndex > 0 && (
        <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
          <div className="text-white text-sm opacity-70 bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
            ↓ Swipe down for previous
          </div>
        </div>
      )}
    </div>
  );
}
