import { RSSScraper } from "./rss-scraper";
import { summarizeArticle } from "./ai-summarizer";
import { connectDB } from "./mongodb";
import Article from "../models/Article";

const MAX_ARTICLES_PER_RUN = 10; // Vercel-safe limit

export class NewsScheduler {
  private scraper = new RSSScraper();

  async fetchAndProcessNews(): Promise<number> {
    await connectDB();

    console.log("🔄 Fetching RSS feeds...");
    const scraped = await this.scraper.fetchAllFeeds();

    console.log(`📰 Scraped ${scraped.length} articles`);

    let added = 0;

    for (const article of scraped) {
      if (added >= MAX_ARTICLES_PER_RUN) break;

      const exists = await Article.exists({ url: article.url });
      if (exists) continue;

      if (!article.text || article.text.length < 800) continue;

      console.log(`🧠 Summarizing: ${article.title}`);

      const summary = await summarizeArticle(article.text);

      await Article.create({
        title: article.title,
        content: article.text,
        summary,
        source: article.source,
        url: article.url,
        publishedAt: article.publishedAt,
        category: article.category,
      });

      added++;
    }

    console.log(`✅ Added ${added} new articles`);
    return added;
  }
}
