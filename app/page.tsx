import NewsReel from "../components/NewsReel";
import PWAInstallPrompt from "../components/PWAInstallPrompt";

async function getArticles() {
  try {
    const res = await fetch("/api/articles", {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

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
