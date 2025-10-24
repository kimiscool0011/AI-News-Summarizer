import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";
import { NewsScheduler } from "../../../lib/scheduler";

export async function GET() {
  try {
    await connectDB();

    // Auto-fetch new news when API is called (with 10-minute cache)
    const lastFetch = await Article.findOne().sort({ createdAt: -1 });
    const shouldRefresh =
      !lastFetch ||
      Date.now() - new Date(lastFetch.createdAt).getTime() > 10 * 60 * 1000; // 10 minutes

    if (shouldRefresh) {
      const scheduler = new NewsScheduler();
      await scheduler.fetchAndProcessNews();
    }

    // Get latest articles
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(50);

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json([], { status: 500 });
  }
}
