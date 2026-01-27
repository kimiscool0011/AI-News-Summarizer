import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

// ❌ Do NOT delete data via GET
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Use POST to clear articles",
    },
    { status: 405 },
  );
}

// ✅ Correct destructive action
export async function POST() {
  try {
    await connectDB();

    const result = await Article.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `🗑️ Cleared ${result.deletedCount} articles`,
      deletedCount: result.deletedCount,
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
