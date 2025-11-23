# Global News AI

A modern, AI-powered news aggregation and summarization application built with Next.js 14, TypeScript, and cutting-edge web technologies.

![Global News AI](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## Features

### Core Functionality
- **Multi-Source News Aggregation**: Fetch news from multiple trusted sources via News API and RSS feeds
- **AI-Powered Summarization**: Generate concise summaries using OpenAI GPT (with intelligent fallback to extractive summaries)
- **Advanced Search**: Full-text search across articles, titles, and sources
- **Category Filtering**: Browse news by Technology, Business, Science, World, and Sports
- **Trending Topics**: Automatically identified trending articles based on recency and source credibility

### User Experience
- **Article Cards**: Clean, informative cards with images, summaries, and metadata
- **Full Article View**: Dedicated pages for deep-diving into articles with AI summaries
- **Bookmark System**: Save articles for later with persistent localStorage
- **Source Credibility Indicators**: Visual indicators showing reliability of news sources
- **Dark/Light Theme**: System-aware theme with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Technical Highlights
- **Server Actions**: Next.js 14 Server Actions for efficient data fetching
- **Real-time Updates**: Live search and filtering without page reloads
- **Type Safety**: Full TypeScript implementation
- **Component Library**: Radix UI primitives for accessible, high-quality components
- **Performance**: Optimized image loading, caching, and parallel data fetching

## Tech Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **next-themes**: Theme management
- **Lucide React**: Beautiful icons

### Backend & APIs
- **Server Actions**: Next.js server-side data fetching
- **News API**: Primary news data source (optional)
- **RSS Parser**: Fallback news aggregation from RSS feeds
- **OpenAI API**: AI-powered summarization (optional)

### Utilities
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional styling utilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) News API key from [newsapi.org](https://newsapi.org/)
- (Optional) OpenAI API key from [platform.openai.com](https://platform.openai.com/)

### Installation

1. Clone or navigate to the project directory:
```bash
cd /home/seanos1a/global-news-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys (both are optional):
```env
# Optional - provides more comprehensive news coverage
NEWS_API_KEY=your_news_api_key_here

# Optional - enables real AI summarization (falls back to extractive summaries)
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build
```bash
npm run build
npm start
```

#### Type Checking
```bash
npm run lint
```

## Project Structure

```
global-news-ai/
├── app/                          # Next.js App Router
│   ├── article/[id]/            # Article detail pages
│   │   └── page.tsx
│   ├── bookmarks/               # Bookmarks page
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Homepage with news feed
│   └── globals.css              # Global styles & CSS variables
├── components/                   # React components
│   ├── ui/                      # Radix UI components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   └── tabs.tsx
│   ├── providers/               # Context providers
│   │   └── theme-provider.tsx
│   ├── article-card.tsx         # News article card component
│   ├── category-filter.tsx      # Category tabs
│   ├── header.tsx               # App header/navigation
│   ├── news-grid.tsx            # Article grid layout
│   ├── search-bar.tsx           # Search input
│   ├── theme-toggle.tsx         # Dark/light mode toggle
│   └── trending-section.tsx     # Trending articles sidebar
├── lib/                         # Utilities & core logic
│   ├── actions/                 # Server Actions
│   │   └── news-actions.ts      # News fetching actions
│   ├── hooks/                   # React hooks
│   │   └── use-bookmarks.ts     # Bookmark management
│   ├── news-fetcher.ts          # RSS & News API integration
│   ├── news-sources.ts          # News source configurations
│   ├── summarizer.ts            # AI & extractive summarization
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript type definitions
│   └── news.ts                  # News article types
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## Configuration

### News Sources

The application aggregates news from multiple high-quality sources configured in `lib/news-sources.ts`:

- **Technology**: TechCrunch, The Verge, Ars Technica
- **Business**: Financial Times, Bloomberg
- **Science**: ScienceDaily, Nature
- **World**: BBC News, Reuters, Al Jazeera
- **Sports**: ESPN, BBC Sport

Each source includes a credibility score (0-100) that powers the credibility indicators.

### Adding Custom News Sources

Edit `lib/news-sources.ts` to add new RSS feeds:

```typescript
{
  source: {
    id: 'source-id',
    name: 'Source Name',
    url: 'https://example.com',
    credibilityScore: 85, // 0-100
    category: 'technology'
  },
  rssUrl: 'https://example.com/rss',
  category: 'technology'
}
```

### Customizing AI Summarization

The summarizer in `lib/summarizer.ts` automatically:
1. Tries OpenAI GPT-3.5-turbo if API key is provided
2. Falls back to extractive summarization (no API required)
3. Generates 2-3 sentence summaries

To modify summary length, edit the `max_tokens` parameter in the OpenAI request.

## API Keys

### News API (Optional)
- Sign up at [newsapi.org](https://newsapi.org/)
- Free tier: 100 requests/day
- Provides: Top headlines, search, filtering
- Fallback: RSS feeds work without this key

### OpenAI API (Optional)
- Get key at [platform.openai.com](https://platform.openai.com/)
- Usage: ~$0.002 per article summary (GPT-3.5-turbo)
- Fallback: Extractive summaries (free)

## Features in Detail

### 1. News Aggregation
- Fetches from News API (if configured) or RSS feeds
- Parallel fetching for improved performance
- Automatic fallback mechanisms
- Caching with Next.js revalidation (5 minutes)

### 2. AI Summarization
- On-demand summary generation
- Batch processing to avoid rate limits
- Smart caching of generated summaries
- Extractive fallback for offline/free usage

### 3. Search & Filtering
- Real-time search across all fields
- Category-based filtering
- Combined search + category filtering
- Optimized for large result sets

### 4. Trending Detection
- Based on article age (last 24 hours)
- Source credibility weighting (80+ score)
- Automatic badge display
- Dedicated trending section

### 5. Bookmarks
- Client-side localStorage persistence
- Add/remove individual bookmarks
- Bulk clear functionality
- Survives page refreshes

### 6. Source Credibility
- Visual indicators (High/Medium/Low)
- Color-coded badges
- Score-based (0-100)
- Configurable per source

### 7. Theming
- System preference detection
- Manual toggle override
- Smooth transitions
- Persistent across sessions

## Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based splitting
- **Server Actions**: Efficient server-side data fetching
- **Parallel Requests**: Concurrent API calls
- **Caching**: RSS feed and API response caching
- **Type Safety**: Compile-time error detection

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### No Articles Loading
- Check if RSS feeds are accessible (some may require VPN)
- Verify News API key if using News API
- Check browser console for errors

### AI Summaries Not Working
- Verify OpenAI API key is correct
- Check API quota/billing
- Fallback extractive summaries should still work

### Theme Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and try again

### Images Not Loading
- Some sources may have CORS restrictions
- Images gracefully hide on error

## Development

### Adding New Features
1. Create components in `components/`
2. Add server actions in `lib/actions/`
3. Update types in `types/`
4. Test thoroughly before deployment

### Code Style
- TypeScript strict mode enabled
- ESLint configuration included
- Tailwind CSS for styling
- Component-first architecture

## License

This project is open source and available for educational and commercial use.

## Acknowledgments

- News data powered by [News API](https://newsapi.org/) and RSS feeds
- AI summaries powered by [OpenAI](https://openai.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)

---

Built with Next.js 14, TypeScript, and modern web technologies.
