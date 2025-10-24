import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { RSSFeed } from "../types";

const parser = new Parser();

export class RSSScraper {
  private feeds: RSSFeed[] = [
    {
      url: "https://nagalandpost.com/category/nagaland-news/feed",
      source: "Nagaland Post",
      category: "nagaland",
    },

    {
      url: "https://morungexpress.com/category/nagaland",
      source: "Morung Express",
      category: "nagaland",
    },

    {
      url: "https://nagalandnewstoday.com/feed/",
      source: "Nagaland News Today",
      category: "nagaland",
    },
    {
      url: "https://nagalandtribune.in/category/nagaland/feed/",
      source: "Nagaland News Today",
      category: "nagaland",
    },
  ];

  async fetchAllFeeds(): Promise<any[]> {
    const allArticles: any[] = [];

    for (const feed of this.feeds) {
      try {
        console.log(`Fetching from: ${feed.source}`);
        const articles = await this.fetchFeed(feed);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Error fetching ${feed.source}:`, error);
      }
    }

    return allArticles;
  }

  private async fetchFeed(feed: RSSFeed): Promise<any[]> {
    try {
      const parsed = await parser.parseURL(feed.url);

      return parsed.items.map((item: any) => ({
        title: item.title,
        description: item.contentSnippet || item.summary,
        content: item["content:encoded"] || item.contentSnippet || "",
        source: feed.source,
        url: item.link,
        publishedAt: new Date(item.pubDate || Date.now()),
        category: feed.category,
      }));
    } catch (error) {
      console.error(`Error parsing feed ${feed.url}:`, error);
      return [];
    }
  }
}
