import Parser from 'rss-parser';
import { NewsArticle, NewsCategory, RSSFeedItem } from '@/types/news';
import { NEWS_SOURCES, getSourcesByCategory } from './news-sources';
import { generateArticleId } from './utils';

const parser = new Parser();

export async function fetchNewsFromRSS(category: NewsCategory = 'all'): Promise<NewsArticle[]> {
  const sources = getSourcesByCategory(category);
  const articles: NewsArticle[] = [];

  // Fetch from multiple sources in parallel
  const results = await Promise.allSettled(
    sources.map(async (sourceConfig) => {
      try {
        const feed = await parser.parseURL(sourceConfig.rssUrl);

        return feed.items.slice(0, 10).map((item): NewsArticle => {
          const articleId = generateArticleId(item.link || '', item.title || '');

          return {
            id: articleId,
            title: item.title || 'Untitled',
            description: item.contentSnippet || item.content || '',
            content: item.content || item.contentSnippet || '',
            url: item.link || '',
            imageUrl: extractImageUrl(item),
            publishedAt: item.pubDate || new Date().toISOString(),
            source: sourceConfig.source,
            author: item.creator || item.author,
            category: sourceConfig.category,
            trending: false
          };
        });
      } catch (error) {
        console.error(`Error fetching from ${sourceConfig.source.name}:`, error);
        return [];
      }
    })
  );

  // Combine all successful results
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  });

  // Sort by date (newest first)
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return articles;
}

export async function fetchNewsFromAPI(
  category: NewsCategory = 'all',
  query?: string
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.warn('NEWS_API_KEY not found, using RSS feeds only');
    return fetchNewsFromRSS(category);
  }

  try {
    const categoryParam = category !== 'all' ? `&category=${category}` : '';
    const queryParam = query ? `&q=${encodeURIComponent(query)}` : '';
    const url = `https://newsapi.org/v2/top-headlines?country=us${categoryParam}${queryParam}&pageSize=50&apiKey=${apiKey}`;

    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    return data.articles.map((article: any): NewsArticle => ({
      id: generateArticleId(article.url, article.title),
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      source: {
        id: article.source.id || generateArticleId(article.source.name, ''),
        name: article.source.name,
        credibilityScore: 75 // Default score for News API sources
      },
      author: article.author,
      category: category !== 'all' ? category : 'world',
      trending: false
    }));
  } catch (error) {
    console.error('Error fetching from News API:', error);
    return fetchNewsFromRSS(category);
  }
}

function extractImageUrl(item: any): string | undefined {
  // Try different common image fields in RSS feeds
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;

  // Try to extract image from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];
  }

  return undefined;
}

export function markTrendingArticles(articles: NewsArticle[]): NewsArticle[] {
  // Simple trending algorithm: recent articles from high-credibility sources
  const last24Hours = Date.now() - 24 * 60 * 60 * 1000;

  return articles.map(article => ({
    ...article,
    trending:
      new Date(article.publishedAt).getTime() > last24Hours &&
      article.source.credibilityScore >= 80
  }));
}

export function filterArticles(
  articles: NewsArticle[],
  query?: string,
  category?: NewsCategory
): NewsArticle[] {
  let filtered = [...articles];

  if (category && category !== 'all') {
    filtered = filtered.filter(article => article.category === category);
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description?.toLowerCase().includes(lowerQuery) ||
      article.source.name.toLowerCase().includes(lowerQuery)
    );
  }

  return filtered;
}
