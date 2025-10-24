import { RSSScraper } from './rss-scraper';
import { AISummarizer } from './ai-summarizer';
import { connectDB } from './mongodb';
import Article from '../models/Article';

export class NewsScheduler {
  private scraper: RSSScraper;
  private summarizer: AISummarizer;

  constructor() {
    this.scraper = new RSSScraper();
    this.summarizer = new AISummarizer();
  }

  async fetchAndProcessNews() {
    try {
      console.log('🔄 Auto-fetching latest news...');
      await connectDB();
      
      const articles = await this.scraper.fetchAllFeeds();
      console.log(`📰 Fetched ${articles.length} raw articles`);
      
      let processedCount = 0;
      
      for (const article of articles) {
        // Check if article already exists
        const existing = await Article.findOne({ url: article.url });
        
        if (!existing) {
          // Process new article
          const summary = await this.summarizer.summarizeText(
            article.content || article.description || ''
          );
          const sentiment = await this.summarizer.analyzeSentiment(
            article.content || article.description || ''
          );
          
          await Article.create({
            ...article,
            summary,
            sentiment
          });
          
          processedCount++;
          console.log(`✅ Processed new article: ${article.title}`);
        }
      }
      
      console.log(`🎯 Added ${processedCount} new articles`);
      return processedCount;
      
    } catch (error) {
      console.error('❌ Scheduler error:', error);
      return 0;
    }
  }
}