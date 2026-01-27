// "use client";

import { NewsArticle } from "../types";

interface NewsReelCardProps {
  article: NewsArticle;
}

export default function NewsReelCard({ article }: NewsReelCardProps) {
  return (
    <div className="relative h-full w-full bg-black text-white safe-area">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-24 safe-area-padding">
        {/* Meta */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
          <span className="uppercase tracking-wide">{article.source}</span>
          <span>
            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[1.4rem] font-semibold leading-snug mb-4 line-clamp-3">
          {article.title}
        </h1>

        {/* Summary */}
        <p className="text-gray-200 text-[0.95rem] leading-relaxed mb-6 line-clamp-5">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Sentiment */}
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300">
            {article.sentiment?.toUpperCase()}
          </span>

          {/* Actions */}
          <button
            onClick={() => window.open(article.url, "_blank")}
            className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 hover:scale-110 active:scale-95 transition"
          >
            Read Full Article
          </button>
        </div>
      </div>
    </div>
  );
}
