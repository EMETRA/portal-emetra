import type { PublishedNews } from "@/lib/content/publishedNews.types";

/**
 * Props de NewsArticle.
 * @param {PublishedNews} noticia - Noticia publicada a mostrar.
 */
interface NewsArticleProps {
  noticia: PublishedNews;
  className?: string;
}

export type { NewsArticleProps };
