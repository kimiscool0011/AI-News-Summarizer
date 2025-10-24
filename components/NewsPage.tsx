"use client";

import { useState, useEffect } from "react";
import NewsReel from "./NewsReel";
import PWAInstallPrompt from "./PWAInstallPrompt";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nagaland News Reels</h1>
          <p className="text-gray-400">Loading news...</p>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nagaland News Reels</h1>
          <p className="text-gray-400 mb-4">No articles available</p>
          <a
            href="/api/refresh-news"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Fetch News
          </a>
        </div>
        <PWAInstallPrompt />
      </div>
    );
  }

  return (
    <>
      <NewsReel articles={articles} />
      <PWAInstallPrompt />
    </>
  );
}
