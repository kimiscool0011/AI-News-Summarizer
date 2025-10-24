import { NewsArticle } from "../types";

interface ArticleCardProps {
  article: NewsArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-gray-800">{article.title}</h2>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            article.sentiment === "positive"
              ? "bg-green-100 text-green-800"
              : article.sentiment === "negative"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {article.sentiment}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-2">Source: {article.source}</p>

      <div className="bg-gray-50 p-4 rounded-lg mb-3">
        <h3 className="font-semibold text-gray-700 mb-1">AI Summary:</h3>
        <p className="text-gray-800">{article.summary}</p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read Full Article →
        </a>
      </div>
    </div>
  );
}
