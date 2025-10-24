"use client";

import { NewsArticle } from "../types";

interface NewsReelCardProps {
  article: NewsArticle;
}

export default function NewsReelCard({ article }: NewsReelCardProps) {
  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-900 to-black text-white relative safe-area">
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0" />

      <div className="relative z-10 h-full flex flex-col justify-end p-4 pb-24 safe-area-padding">
        {/* Source and Time - Mobile optimized */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-medium bg-black/50 px-2 py-1 rounded">
            {article.source}
          </span>
          <span className="text-gray-300">
            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Sentiment Badge - Larger for mobile */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              article.sentiment === "positive"
                ? "bg-green-600 text-white"
                : article.sentiment === "negative"
                ? "bg-red-600 text-white"
                : "bg-gray-600 text-white"
            }`}
          >
            {article.sentiment?.toUpperCase()}
          </span>
        </div>

        {/* Headline - Mobile optimized font sizes */}
        <h1 className="text-xl font-bold mb-3 leading-tight line-clamp-3">
          {article.title}
        </h1>

        {/* AI Summary - Better mobile spacing */}
        <div className="mb-4">
          <div className="flex items-center mb-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            AI SUMMARY
          </div>
          <p className="text-gray-200 leading-relaxed text-sm line-clamp-4">
            {article.summary}
          </p>
        </div>

        {/* Action Buttons - Mobile optimized */}
        <div className="flex space-x-3 mb-2">
          <button
            onClick={() => window.open(article.url, "_blank")}
            className="flex-1 bg-white text-black py-3 rounded-lg font-semibold text-sm text-center hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
          >
            📖 Read Full Story
          </button>
          <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation">
            <span className="text-lg">🔖</span>
          </button>
        </div>
      </div>

      {/* Bottom safe area spacer */}
      <div className="h-8" />
    </div>
  );
}
