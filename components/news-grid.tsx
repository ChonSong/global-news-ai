'use client';

import { NewsArticle } from '@/types/news';
import { ArticleCard } from './article-card';
import { useBookmarks } from '@/lib/hooks/use-bookmarks';

interface NewsGridProps {
  articles: NewsArticle[];
  showSummary?: boolean;
}

export function NewsGrid({ articles, showSummary = true }: NewsGridProps) {
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const handleBookmark = (article: NewsArticle) => {
    if (isBookmarked(article.id)) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No articles found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onBookmark={handleBookmark}
          isBookmarked={isBookmarked(article.id)}
          showSummary={showSummary}
        />
      ))}
    </div>
  );
}
