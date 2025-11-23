'use client';

import { useState, useEffect } from 'react';
import { NewsArticle, BookmarkedArticle } from '@/types/news';

const BOOKMARKS_KEY = 'global-news-ai-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load bookmarks from localStorage
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookmarks(parsed);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save bookmarks to localStorage whenever they change
    if (isLoaded) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = (article: NewsArticle) => {
    const bookmarkedArticle: BookmarkedArticle = {
      ...article,
      bookmarkedAt: new Date().toISOString()
    };

    setBookmarks((prev) => {
      // Prevent duplicates
      if (prev.some((b) => b.id === article.id)) {
        return prev;
      }
      return [bookmarkedArticle, ...prev];
    });
  };

  const removeBookmark = (articleId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== articleId));
  };

  const isBookmarked = (articleId: string): boolean => {
    return bookmarks.some((b) => b.id === articleId);
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearBookmarks,
    isLoaded
  };
}
