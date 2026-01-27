import Parser from "rss-parser";
import * as cheerio from "cheerio";

// Define strict types if not imported
export type ScrapedArticle = {
  title: string;
  text: string;
  source: string;
  url: string;
  publishedAt: Date;
  category: string;
};

// Add Custom Field Support for RSS Parser
const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ["content:encoded", "content"], // Ensure we catch variations
  },
});

export class RSSScraper {
  private feeds = [
    {
      url: "https://nagalandpost.com/category/nagaland-news/feed",
      source: "Nagaland Post",
      category: "nagaland",
    },
    {
      url: "https://nagalandnewstoday.com/feed/",
      source: "Nagaland News Today",
      category: "nagaland",
    },
    {
      url: "https://nagalandtribune.in/category/nagaland/feed/",
      source: "Nagaland Tribune",
      category: "nagaland",
    },
  ];

  async fetchAllFeeds(): Promise<ScrapedArticle[]> {
    const results: ScrapedArticle[] = [];

    for (const feed of this.feeds) {
      try {
        const parsed = await parser.parseURL(feed.url);

        for (const item of parsed.items) {
          if (!item.title || !item.link) continue;

          // ✅ FALLBACK STRATEGY: Try encoded content first, then content, then description
          const rawContent =
            (item as any)["content:encoded"] ||
            item.content ||
            item.contentSnippet ||
            "";

          // Skip if raw content is too short (likely just a link or empty)
          if (!rawContent || rawContent.length < 100) continue;

          const text = this.extractAndClean(rawContent, item.title);

          // ✅ Adjusted Filter: 250 chars (~40 words) allows short updates/briefs
          if (!text || text.length < 250) continue;

          results.push({
            title: item.title,
            text,
            source: feed.source,
            url: item.link,
            publishedAt: new Date(item.pubDate || Date.now()),
            category: feed.category,
          });
        }
      } catch (err) {
        console.error(`RSS error (${feed.source}):`, err);
      }
    }

    return results;
  }

  // ===============================
  // CLEANER & PROCESSOR
  // ===============================
  private extractAndClean(html: string, title: string): string {
    const $ = cheerio.load(html);

    // Remove junk elements
    $("script, style, figure, img, iframe, .wpp-widget-placeholder").remove();

    const paragraphs: string[] = [];

    $("p").each((_, el) => {
      // Clean whitespace explicitly inside the loop to check true length
      const cleanLine = $(el).text().replace(/\s+/g, " ").trim();

      // Keep slightly shorter lines (captures list items formatted as P)
      if (cleanLine.length > 20) {
        paragraphs.push(cleanLine);
      }
    });

    if (paragraphs.length === 0) return "";

    // 🔴 SMART TITLE REMOVAL
    // Only remove the first paragraph if it is strictly similar to the title
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const titleRegex = new RegExp(`^${escapedTitle}`, "i");

    // Check if P[0] is basically just the title
    if (paragraphs[0] && titleRegex.test(paragraphs[0])) {
      // If the paragraph is JUST the title (or very close), remove it.
      if (paragraphs[0].length < title.length + 20) {
        paragraphs.shift();
      } else {
        // If the title is just a prefix to a real sentence, strip the title string only
        paragraphs[0] = paragraphs[0].replace(titleRegex, "").trim();
      }
    }

    // ❌ REMOVED: paragraphs.shift() for "lead bias"
    // Reason: The first paragraph of a news story contains 80% of the context.
    // Removing it creates confusing, low-quality data.

    return paragraphs.join("\n\n").trim();
  }
}
