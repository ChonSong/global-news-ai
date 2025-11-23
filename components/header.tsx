'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Bookmark, Newspaper } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Global News AI</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/bookmarks">
              <Bookmark className="h-5 w-5" />
              <span className="ml-2 hidden sm:inline">Bookmarks</span>
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
