import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';

export async function GET() {
  try {
    console.log('🔗 Testing MongoDB connection...');
    
    // Mask password in logs
    const uri = process.env.MONGODB_URI || '';
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('Using URI:', maskedUri);
    
    await connectDB();
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ MongoDB connected successfully!',
      cluster: 'cluster0.7pd41jz.mongodb.net',
      user: 'xoxiday'
    });
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      hint: 'Check password and network access'
    }, { status: 500 });
  }
}