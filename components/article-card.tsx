'use client';

import { NewsArticle } from '@/types/news';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getCredibilityColor, getCredibilityLabel } from '@/lib/utils';
import { Bookmark, ExternalLink, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  article: NewsArticle;
  onBookmark?: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  showSummary?: boolean;
}

export function ArticleCard({ article, onBookmark, isBookmarked, showSummary = true }: ArticleCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      {article.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {article.category}
            </Badge>
            {article.trending && (
              <Badge className="bg-orange-500 text-white">
                <TrendingUp className="mr-1 h-3 w-3" />
                Trending
              </Badge>
            )}
          </div>
          {onBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onBookmark(article)}
              className="h-8 w-8"
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`}
              />
            </Button>
          )}
        </div>

        <Link href={`/article/${article.id}`} className="group/link">
          <h3 className="text-lg font-semibold leading-tight group-hover/link:text-primary">
            {article.title}
          </h3>
        </Link>

        {showSummary && (article.summary || article.description) && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {article.summary || article.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{article.source.name}</span>
              <span className={`font-semibold ${getCredibilityColor(article.source.credibilityScore)}`}>
                {getCredibilityLabel(article.source.credibilityScore)}
              </span>
            </div>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
