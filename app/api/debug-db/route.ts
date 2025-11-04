import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";

export async function GET() {
  try {
    await connectDB();

    // Get database stats
    const totalArticles = await Article.countDocuments();
    const latestArticle = await Article.findOne().sort({ createdAt: -1 });

    // Get collection names safely
    const db = Article.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

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
        collectionNames,
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
