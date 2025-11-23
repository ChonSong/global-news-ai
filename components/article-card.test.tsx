import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from './article-card';
import { NewsArticle } from '@/types/news';
import { vi } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: (props: any) => {
    return <a href={props.href}>{props.children}</a>;
  },
}));

const mockArticle: NewsArticle = {
  id: '1',
  title: 'Test Article Title',
  description: 'Test Description',
  url: 'https://example.com/article',
  imageUrl: 'https://example.com/image.jpg',
  publishedAt: '2023-01-01T10:00:00Z',
  source: {
    id: 'source-1',
    name: 'Test Source',
    credibilityScore: 90,
  },
  category: 'technology',
  trending: true,
};

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('calls onBookmark when bookmark button is clicked', () => {
    const onBookmark = vi.fn();
    render(<ArticleCard article={mockArticle} onBookmark={onBookmark} />);

    const bookmarkButton = screen.getByRole('button', { name: '' }); // The button has no text, just icon
    // Actually the button has no aria-label, so we might need to find it by icon or class.
    // The button has `size="icon"` and contains Bookmark icon.
    // Let's rely on the fact it's a button. There are two buttons: bookmark and external link.
    // The bookmark button is rendered only if onBookmark is provided.
    
    // Let's use getByRole('button') and filter/index, or better, add aria-label to component (improvement).
    // For now, let's find all buttons and click the first one (it appears first in DOM order within the card content block).
    
    const buttons = screen.getAllByRole('button');
    // 1st button: Bookmark (if onBookmark passed)
    // 2nd button: External link (variant ghost, size sm, asChild -> it's an anchor, so technically maybe not a button role if asChild? wait, Button asChild renders the child. The child is <a>. So it will have role link, not button.)
    // Wait, the bookmark button is a real button. The external link is an anchor styled as button.
    
    fireEvent.click(buttons[0]);
    expect(onBookmark).toHaveBeenCalledWith(mockArticle);
  });
});
