import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";

export async function GET() {
  try {
    console.log("🔄 API: Connecting to database...");
    await connectDB();
    console.log("✅ API: Database connected");

    console.log("📖 API: Fetching articles from MongoDB...");
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(50);

    console.log(`📰 API: Found ${articles.length} articles in database`);

    if (articles.length > 0) {
      console.log("📄 First article:", {
        title: articles[0].title,
        source: articles[0].source,
        url: articles[0].url,
      });
    }

    return NextResponse.json(articles);
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        error: error.message,
        details: "Failed to fetch articles from database",
      },
      { status: 500 }
    );
  }
}
