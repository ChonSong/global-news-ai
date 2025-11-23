export type NewsCategory =
  | 'technology'
  | 'business'
  | 'science'
  | 'world'
  | 'sports'
  | 'all';

export interface NewsSource {
  id: string;
  name: string;
  url?: string;
  credibilityScore: number; // 0-100
  category?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: NewsSource;
  author?: string;
  category: NewsCategory;
  summary?: string;
  trending?: boolean;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  'media:content'?: {
    $: {
      url: string;
    };
  };
}

export interface SearchParams {
  query?: string;
  category?: NewsCategory;
  page?: number;
}

export interface BookmarkedArticle extends NewsArticle {
  bookmarkedAt: string;
}
