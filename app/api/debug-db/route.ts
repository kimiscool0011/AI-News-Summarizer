import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";

export async function GET() {
  try {
    await connectDB();

    // Get database stats
    const totalArticles = await Article.countDocuments();
    const latestArticle = await Article.findOne().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      databaseInfo: {
        totalArticles,
        latestArticle: latestArticle
          ? {
              title: latestArticle.title,
              source: latestArticle.source,
              createdAt: latestArticle.createdAt,
            }
          : null,
        connected: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
