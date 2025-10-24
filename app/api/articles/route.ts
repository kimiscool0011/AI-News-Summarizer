import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Article from "../../../models/Article";

export const dynamic = "force-dynamic"; // Ensure API route is dynamic

export async function GET() {
  try {
    await connectDB();

    const articles = await Article.find().sort({ publishedAt: -1 }).limit(50);

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json([], { status: 500 });
  }
}
