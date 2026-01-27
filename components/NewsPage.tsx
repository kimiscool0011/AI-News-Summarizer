// "use client";

// import { useState, useEffect } from "react";
// import NewsReel from "./NewsReel";
// import PWAInstallPrompt from "./PWAInstallPrompt";

// export default function NewsPage() {
//   const [articles, setArticles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const res = await fetch("/api/articles");
//         if (!res.ok) throw new Error("Failed to fetch");

//         const data = await res.json();

//         // ✅ NORMALIZE RESPONSE SHAPE
//         if (Array.isArray(data)) {
//           setArticles(data);
//         } else if (Array.isArray(data.articles)) {
//           setArticles(data.articles);
//         } else {
//           setArticles([]);
//         }
//       } catch (error) {
//         console.error("Error fetching articles:", error);
//         setArticles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-screen bg-black flex items-center justify-center text-white">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Nagaland News Reels</h1>
//           <p className="text-gray-400">Loading news...</p>
//         </div>
//       </div>
//     );
//   }

//   if (articles.length === 0) {
//     return (
//       <div className="h-screen bg-black flex items-center justify-center text-white">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Nagaland News Reels</h1>
//           <p className="text-gray-400 mb-4">No articles available</p>
//           <a
//             href="/api/refresh-news"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//           >
//             Fetch News
//           </a>
//         </div>
//         <PWAInstallPrompt />
//       </div>
//     );
//   }

//   return (
//     <>
//       <NewsReel articles={articles} />
//       <PWAInstallPrompt />
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import NewsReel from "./NewsReel";
import PWAInstallPrompt from "./PWAInstallPrompt";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // ✅ NORMALIZE RESPONSE SHAPE
      if (Array.isArray(data)) {
        setArticles(data);
      } else if (Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshNews = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/refresh-news", { method: "POST" });
      if (!res.ok) throw new Error("Failed to refresh");

      // Refetch articles after refresh completes
      await fetchArticles();
    } catch (error) {
      console.error("Error refreshing news:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
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
          <button
            onClick={handleRefreshNews}
            disabled={refreshing}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {refreshing ? "Fetching..." : "Fetch News"}
          </button>
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
