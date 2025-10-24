import { NextResponse } from 'next/server';
import { NewsScheduler } from '../../../lib/scheduler';

export async function GET() {
  try {
    const scheduler = new NewsScheduler();
    const newCount = await scheduler.fetchAndProcessNews();
    
    return NextResponse.json({ 
      success: true,
      message: `Added ${newCount} new articles`,
      newCount 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}