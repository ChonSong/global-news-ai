'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, NewsCategory } from '@/types/news';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { NewsGrid } from '@/components/news-grid';
import { TrendingSection } from '@/components/trending-section';
import { getNews, searchNews } from '@/lib/actions/news-actions';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const newsData = await getNews('all');
      setArticles(newsData);
      setTrendingArticles(newsData.filter(a => a.trending));
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: NewsCategory) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setLoading(true);
    try {
      const newsData = await getNews(category);
      setArticles(newsData);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      handleCategoryChange(selectedCategory);
      return;
    }

    setLoading(true);
    try {
      const results = await searchNews({
        query,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      setArticles(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Latest News & Updates
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered summaries from trusted sources worldwide
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <NewsGrid articles={articles} />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <TrendingSection articles={trendingArticles} />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Global News AI - Powered by AI summarization and multiple news sources</p>
        </div>
      </footer>
    </div>
  );
}
