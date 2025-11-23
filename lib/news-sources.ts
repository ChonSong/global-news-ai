import { NewsCategory, NewsSource } from '@/types/news';

export interface NewsSourceConfig {
  source: NewsSource;
  rssUrl: string;
  category: NewsCategory;
}

// Credibility scores are illustrative
export const NEWS_SOURCES: NewsSourceConfig[] = [
  // Technology
  {
    source: {
      id: 'techcrunch',
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      credibilityScore: 85,
      category: 'technology'
    },
    rssUrl: 'https://techcrunch.com/feed/',
    category: 'technology'
  },
  {
    source: {
      id: 'the-verge',
      name: 'The Verge',
      url: 'https://theverge.com',
      credibilityScore: 82,
      category: 'technology'
    },
    rssUrl: 'https://www.theverge.com/rss/index.xml',
    category: 'technology'
  },
  {
    source: {
      id: 'ars-technica',
      name: 'Ars Technica',
      url: 'https://arstechnica.com',
      credibilityScore: 88,
      category: 'technology'
    },
    rssUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'technology'
  },
  // Business
  {
    source: {
      id: 'financial-times',
      name: 'Financial Times',
      url: 'https://ft.com',
      credibilityScore: 92,
      category: 'business'
    },
    rssUrl: 'https://www.ft.com/?format=rss',
    category: 'business'
  },
  {
    source: {
      id: 'bloomberg',
      name: 'Bloomberg',
      url: 'https://bloomberg.com',
      credibilityScore: 90,
      category: 'business'
    },
    rssUrl: 'https://www.bloomberg.com/feed/podcast/etf-report',
    category: 'business'
  },
  // Science
  {
    source: {
      id: 'science-daily',
      name: 'ScienceDaily',
      url: 'https://sciencedaily.com',
      credibilityScore: 87,
      category: 'science'
    },
    rssUrl: 'https://www.sciencedaily.com/rss/all.xml',
    category: 'science'
  },
  {
    source: {
      id: 'nature',
      name: 'Nature',
      url: 'https://nature.com',
      credibilityScore: 95,
      category: 'science'
    },
    rssUrl: 'https://www.nature.com/nature.rss',
    category: 'science'
  },
  // World
  {
    source: {
      id: 'bbc-news',
      name: 'BBC News',
      url: 'https://bbc.com/news',
      credibilityScore: 88,
      category: 'world'
    },
    rssUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'world'
  },
  {
    source: {
      id: 'reuters',
      name: 'Reuters',
      url: 'https://reuters.com',
      credibilityScore: 91,
      category: 'world'
    },
    rssUrl: 'https://www.reutersagency.com/feed/',
    category: 'world'
  },
  {
    source: {
      id: 'al-jazeera',
      name: 'Al Jazeera',
      url: 'https://aljazeera.com',
      credibilityScore: 82,
      category: 'world'
    },
    rssUrl: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'world'
  },
  // Sports
  {
    source: {
      id: 'espn',
      name: 'ESPN',
      url: 'https://espn.com',
      credibilityScore: 80,
      category: 'sports'
    },
    rssUrl: 'https://www.espn.com/espn/rss/news',
    category: 'sports'
  },
  {
    source: {
      id: 'bbc-sport',
      name: 'BBC Sport',
      url: 'https://bbc.com/sport',
      credibilityScore: 85,
      category: 'sports'
    },
    rssUrl: 'http://feeds.bbci.co.uk/sport/rss.xml',
    category: 'sports'
  }
];

export function getSourcesByCategory(category: NewsCategory): NewsSourceConfig[] {
  if (category === 'all') return NEWS_SOURCES;
  return NEWS_SOURCES.filter(source => source.category === category);
}

export function getSourceById(id: string): NewsSourceConfig | undefined {
  return NEWS_SOURCES.find(source => source.source.id === id);
}
