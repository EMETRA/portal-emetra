"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NewsList } from "@/components/server/organisms/NewsList";
import type { NewsListStatus } from "@/components/server/organisms/NewsList";
import { fetchPublishedNews } from "@/lib/content/publishedNews.api";
import type {
  PublishedNewsPage,
  PublishedNewsSummary,
} from "@/lib/content/publishedNews.types";
import styles from "./HomeNewsListSection.module.scss";

/** Noticias por página (carrusel desktop y lista mobile). */
const PAGE_SIZE = 3;

/** Debe coincidir con $breakpoint-mobile-max (src/theme/sizes.scss). */
const MOBILE_QUERY = "(max-width: 1399.98px)";

const getHref = (noticia: PublishedNewsSummary) =>
  `/noticias/${encodeURIComponent(noticia.slug)}`;

/**
 * Sección "Noticias" del home (COM-04, ancla #noticias). Reemplaza a la
 * antigua "Últimas noticias". Datos de GET /public/news (api-portal).
 */
export default function HomeNewsListSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [page, setPage] = useState(1);
  const [reintento, setReintento] = useState(0);
  const [data, setData] = useState<PublishedNewsPage | null>(null);
  const [status, setStatus] = useState<NewsListStatus>("loading");

  useEffect(() => {
    let cancelado = false;
    setStatus("loading");

    fetchPublishedNews({ page, limit: PAGE_SIZE })
      .then((respuesta) => {
        if (cancelado) return;
        setData(respuesta);
        setStatus(respuesta.total === 0 ? "empty" : "ready");
      })
      .catch(() => {
        if (!cancelado) setStatus("error");
      });

    return () => {
      cancelado = true;
    };
  }, [page, reintento]);

  const cambiarPagina = useCallback((nueva: number) => {
    setPage(nueva);
    // En mobile las cards están apiladas: volver al inicio de la sección.
    if (window.matchMedia(MOBILE_QUERY).matches) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <section id="noticias" ref={sectionRef} className={styles.section}>
      <NewsList
        status={status}
        noticias={data?.items ?? []}
        page={page}
        totalPages={totalPages}
        onPageChange={cambiarPagina}
        onRetry={() => setReintento((valor) => valor + 1)}
        getHref={getHref}
        pageSize={PAGE_SIZE}
      />
    </section>
  );
}
