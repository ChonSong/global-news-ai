'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NewsArticle } from '@/types/news';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNews } from '@/lib/actions/news-actions';
import { getArticleSummary } from '@/lib/actions/news-actions';
import { formatDate, getCredibilityColor, getCredibilityLabel } from '@/lib/utils';
import { useBookmarks } from '@/lib/hooks/use-bookmarks';
import { ArrowLeft, Bookmark, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      // TODO: optimize this by fetching single article from API/DB instead of all news
      // Currently limitation of RSS/NewsAPI implementation without backend persistence
      const articles = await getNews('all');
      const found = articles.find(a => a.id === articleId);

      if (found) {
        setArticle(found);
        if (found.summary) {
          setSummary(found.summary);
        }
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!article) return;

    setLoadingSummary(true);
    try {
      const generatedSummary = await getArticleSummary(article);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleBookmark = () => {
    if (!article) return;

    if (isBookmarked(article.id)) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Article Not Found</h1>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>

        <article className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {article.category}
              </Badge>
              {article.trending && (
                <Badge className="bg-orange-500 text-white">Trending</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBookmark}>
                <Bookmark
                  className={`mr-2 h-4 w-4 ${isBookmarked(article.id) ? 'fill-current text-yellow-500' : ''}`}
                />
                {isBookmarked(article.id) ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read Original
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight">{article.title}</h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 border-b pb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{article.source.name}</span>
              <span className={`font-semibold ${getCredibilityColor(article.source.credibilityScore)}`}>
                {getCredibilityLabel(article.source.credibilityScore)} Credibility
              </span>
            </div>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.author && <span>By {article.author}</span>}
          </div>

          {article.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <div className="relative aspect-video w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {summary && (
            <div className="mb-8 rounded-lg border bg-muted/50 p-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                AI-Generated Summary
              </div>
              <p className="leading-relaxed">{summary}</p>
            </div>
          )}

          {!summary && (
            <div className="mb-8">
              <Button onClick={handleGenerateSummary} disabled={loadingSummary}>
                {loadingSummary ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Summary
                  </>
                )}
              </Button>
            </div>
          )}

          {article.description && (
            <div className="mb-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {article.description}
              </p>
            </div>
          )}

          {article.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          )}

          <div className="mt-8 rounded-lg border bg-card p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              This is a preview. For the full article and additional content, visit the original source.
            </p>
            <Button asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read Full Article on {article.source.name}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </article>
      </main>
    </div>
  );
}
