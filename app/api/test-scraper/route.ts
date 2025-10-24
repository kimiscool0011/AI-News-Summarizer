import { NextResponse } from 'next/server';
import { RSSScraper } from '../../../lib/rss-scraper';
import { AISummarizer } from '../../../lib/ai-summarizer';
import { connectDB } from '../../../lib/mongodb';
import Article from '../../../models/Article';

export async function GET() {
  try {
    console.log('Starting test-scraper...');
    
    await connectDB();
    console.log('Database connected');
    
    const scraper = new RSSScraper();
    const summarizer = new AISummarizer();
    
    const articles = await scraper.fetchAllFeeds();
    console.log(`Fetched ${articles.length} articles`);
    
    if (articles.length === 0) {
      return NextResponse.json({ 
        message: 'No articles fetched - check RSS feeds',
        articles: [] 
      });
    }
    
    // Process first 2 articles
    for (let i = 0; i < Math.min(2, articles.length); i++) {
      const article = articles[i];
      console.log(`Processing article: ${article.title}`);
      
      const summary = await summarizer.summarizeText(article.content || article.description || '');
      const sentiment = await summarizer.analyzeSentiment(article.content || article.description || '');
      
      await Article.findOneAndUpdate(
        { url: article.url },
        {
          title: article.title,
          description: article.description,
          content: article.content,
          source: article.source,
          url: article.url,
          publishedAt: article.publishedAt,
          category: article.category,
          summary,
          sentiment
        },
        { upsert: true, new: true }
      );
    }
    
    return NextResponse.json({ 
      message: `Processed ${Math.min(2, articles.length)} articles`,
      totalFetched: articles.length 
    });
    
  } catch (error: any) {
    console.error('Test error details:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error.message 
    }, { status: 500 });
  }
}