import { NewsArticle } from '@/types/news';

export async function summarizeArticle(article: NewsArticle): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateMockSummary(article);
  }

  try {
    const content = article.content || article.description || article.title;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional news summarizer. Provide concise, accurate summaries of news articles in 2-3 sentences. Focus on the key facts and main points.'
          },
          {
            role: 'user',
            content: `Summarize this news article:\n\nTitle: ${article.title}\n\nContent: ${content}`
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateMockSummary(article);
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return generateMockSummary(article);
  }
}

export async function summarizeMultipleArticles(articles: NewsArticle[]): Promise<NewsArticle[]> {
  // Summarize in batches to avoid rate limits
  const batchSize = 5;
  const results: NewsArticle[] = [];

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);

    const summaries = await Promise.all(
      batch.map(async (article) => {
        if (article.summary) return article;

        const summary = await summarizeArticle(article);
        return { ...article, summary };
      })
    );

    results.push(...summaries);
  }

  return results;
}

function generateMockSummary(article: NewsArticle): string {
  // Generate a simple extractive summary from description or content
  const text = article.description || article.content || article.title;

  if (!text) {
    return 'Summary not available.';
  }

  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');

  // Take first 2-3 sentences or 200 characters
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
  const summary = sentences.slice(0, 3).join(' ').trim();

  if (summary.length > 300) {
    return summary.substring(0, 297) + '...';
  }

  return summary || 'This article provides important information on current events. Read the full article for more details.';
}

export function extractKeyPoints(article: NewsArticle): string[] {
  const content = article.content || article.description || '';
  const cleanContent = content.replace(/<[^>]*>/g, '');

  // Simple extraction of sentences
  const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || [];

  // Return up to 3 key sentences
  return sentences
    .filter(s => s.length > 30 && s.length < 200)
    .slice(0, 3)
    .map(s => s.trim());
}

export async function generateTrendingSummary(articles: NewsArticle[]): Promise<string> {
  const trendingArticles = articles.filter(a => a.trending).slice(0, 5);

  if (trendingArticles.length === 0) {
    return 'No trending articles at the moment.';
  }

  const topics = trendingArticles.map(a => a.title).join('; ');

  return `Top trending topics include: ${topics.substring(0, 200)}...`;
}
