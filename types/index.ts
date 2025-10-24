export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
  summary?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
}

export interface RSSFeed {
  url: string;
  source: string;
  category: string;
}