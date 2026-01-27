import { NextResponse } from "next/server";
import { RSSScraper } from "@/lib/rss-scraper";
import { summarizeArticle } from "@/lib/ai-summarizer";

export async function GET() {
  try {
    // 1️⃣ Get raw scraped article text
    const scraper = new RSSScraper();
    const articles = await scraper.fetchAllFeeds();

    if (!articles.length) {
      return NextResponse.json({
        success: false,
        error: "No articles scraped",
      });
    }

    // 2️⃣ Take the first article for testing
    const article = articles[0];

    // 3️⃣ Run AI summarizer ONLY
    const summary = await summarizeArticle(article.text, article.title);

    return NextResponse.json({
      success: true,
      title: article.title,
      source: article.source,
      url: article.url,
      inputLength: article.text.length,
      inputPreview: article.text.slice(0, 500),
      aiSummary: summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
