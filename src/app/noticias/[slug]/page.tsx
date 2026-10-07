import type { Metadata } from "next";
import PublishedNewsPage from "@/components/client/PublishedNewsPage/PublishedNewsPage";
import { fetchPublishedNewsMetadata } from "@/lib/content/publishedNews.server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Título de la pestaña y descripción para buscadores, según la noticia. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await fetchPublishedNewsMetadata(slug);
  if (!noticia) return {};
  return {
    title: noticia.titulo,
    ...(noticia.descripcion ? { description: noticia.descripcion } : {}),
  };
}

export default function NoticiaPage() {
  return <PublishedNewsPage />;
}
