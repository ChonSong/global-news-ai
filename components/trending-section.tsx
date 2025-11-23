'use client';

import { NewsArticle } from '@/types/news';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { formatDate } from '@/lib/utils';

interface TrendingSectionProps {
  articles: NewsArticle[];
}

export function TrendingSection({ articles }: TrendingSectionProps) {
  if (articles.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-orange-500" />
        <h2 className="text-xl font-bold">Trending Now</h2>
      </div>
      <div className="space-y-4">
        {articles.slice(0, 5).map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group block border-b pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex gap-3">
              <span className="text-2xl font-bold text-muted-foreground">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold leading-tight group-hover:text-primary">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{article.source.name}</span>
                  <span>•</span>
                  <time>{formatDate(article.publishedAt)}</time>
                  <Badge variant="outline" className="capitalize">
                    {article.category}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
