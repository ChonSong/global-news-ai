'use server';

import { NewsArticle, NewsCategory, SearchParams } from '@/types/news';
import { fetchNewsFromAPI, fetchNewsFromRSS, filterArticles, markTrendingArticles } from '@/lib/news-fetcher';
import { summarizeArticle, summarizeMultipleArticles } from '@/lib/summarizer';

export async function getNews(category: NewsCategory = 'all'): Promise<NewsArticle[]> {
  try {
    // Try News API first, fallback to RSS
    let articles = await fetchNewsFromAPI(category);

    if (articles.length === 0) {
      articles = await fetchNewsFromRSS(category);
    }

    // Mark trending articles
    articles = markTrendingArticles(articles);

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function searchNews(params: SearchParams): Promise<NewsArticle[]> {
  try {
    const { query, category = 'all' } = params;

    let articles: NewsArticle[];

    if (query) {
      // If there's a search query, use News API for better results
      articles = await fetchNewsFromAPI(category, query);
    } else {
      articles = await getNews(category);
    }

    // Apply additional filtering
    articles = filterArticles(articles, query, category);

    return articles;
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
}

export async function getTrendingNews(): Promise<NewsArticle[]> {
  try {
    const articles = await getNews('all');
    return articles.filter(article => article.trending).slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
}

export async function getArticleSummary(article: NewsArticle): Promise<string> {
  try {
    if (article.summary) {
      return article.summary;
    }

    const summary = await summarizeArticle(article);
    return summary;
  } catch (error) {
    console.error('Error generating article summary:', error);
    return 'Summary not available.';
  }
}

export async function getNewsWithSummaries(category: NewsCategory = 'all'): Promise<NewsArticle[]> {
  try {
    let articles = await getNews(category);

    // Limit to first 20 articles for summarization to manage API costs
    articles = articles.slice(0, 20);

    // Generate summaries
    articles = await summarizeMultipleArticles(articles);

    return articles;
  } catch (error) {
    console.error('Error fetching news with summaries:', error);
    return [];
  }
}

export async function getCategorizedNews(): Promise<Record<NewsCategory, NewsArticle[]>> {
  try {
    const categories: NewsCategory[] = ['technology', 'business', 'science', 'world', 'sports'];

    const results = await Promise.all(
      categories.map(async (category) => {
        const articles = await getNews(category);
        return { category, articles: articles.slice(0, 5) };
      })
    );

    const categorized: Record<string, NewsArticle[]> = {};
    results.forEach(({ category, articles }) => {
      categorized[category] = articles;
    });

    return categorized as Record<NewsCategory, NewsArticle[]>;
  } catch (error) {
    console.error('Error fetching categorized news:', error);
    return {
      technology: [],
      business: [],
      science: [],
      world: [],
      sports: [],
      all: []
    };
  }
}
