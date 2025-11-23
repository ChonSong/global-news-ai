'use client';

import { NewsGrid } from '@/components/news-grid';
import { useBookmarks } from '@/lib/hooks/use-bookmarks';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks, isLoaded } = useBookmarks();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-4xl font-bold tracking-tight">
              <Bookmark className="h-8 w-8 text-yellow-500" />
              Bookmarked Articles
            </h1>
            <p className="text-lg text-muted-foreground">
              {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
            </p>
          </div>

          {bookmarks.length > 0 && (
            <Button
              variant="outline"
              onClick={clearBookmarks}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {!isLoaded ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-lg font-medium text-muted-foreground">No bookmarks yet</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Start bookmarking articles to save them for later
              </p>
              <Button asChild>
                <Link href="/">Browse News</Link>
              </Button>
            </div>
          </div>
        ) : (
          <NewsGrid articles={bookmarks} showSummary={true} />
        )}
      </main>
    </div>
  );
}
