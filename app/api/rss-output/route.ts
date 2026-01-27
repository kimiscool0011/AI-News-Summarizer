import { NextResponse } from "next/server";
import { RSSScraper } from "@/lib/rss-scraper";

export async function GET() {
  try {
    const scraper = new RSSScraper();
    const articles = await scraper.fetchAllFeeds();

    // Return only what matters for summarization
    const debug = articles.map((a, index) => ({
      index,
      title: a.title,
      source: a.source,
      url: a.url,
      textLength: a.text.length,
      preview: a.text.slice(0, 500), // 🔍 first 500 chars fed to AI
      fullText: a.text, // ⚠️ full cleaned content
    }));

    return NextResponse.json({
      count: debug.length,
      articles: debug,
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
