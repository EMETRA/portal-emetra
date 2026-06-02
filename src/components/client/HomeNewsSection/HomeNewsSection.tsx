"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/server/atoms";
import { NewCard } from "@/components/molecules/NewCard";
import NewsCarrousel from "@/components/organisms/NewsCarrousel/NewsCarrousel";
import { Separator } from "@/components/atoms/Separator";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";
import { assertOkResponse } from "@/lib/bff/raw";
import type { NewsListResponseDto } from "@/lib/content/mappers";
import type { NewsSummaryDto } from "@/lib/content/types";
import classNames from "classnames";
import styles from "@/app/page.module.css";

const DEFAULT_NEWS_IMAGE = "/images/Evento.jpg";

const NEWS_API =
  "/api/news?estado=borrador&visibilidad=publica&idioma=es-GT&page=1&limit=10";

function formatDateToSpanish(dateISO?: string | null) {
  if (!dateISO) {
    return "Fecha no disponible";
  }

  const formatter = new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formatter.format(new Date(dateISO));
}

export default function HomeNewsSection() {
  const [latestNews, setLatestNews] = useState<NewsSummaryDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const response = await fetch(NEWS_API, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        await assertOkResponse(response);
        const data = (await response.json()) as NewsListResponseDto;
        setLatestNews(data.items ?? []);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar las noticias.";
        setError(message);
        setLatestNews([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <>
      <Separator>
        <div className={classNames(styles.Heading)}>
          <Icon name="Notification" className={classNames(styles.Icon)} />
          <h1 className={classNames(styles.Title)}>ÚLTIMAS NOTICIAS</h1>
        </div>
      </Separator>

      {error ? (
        <ServiceErrorAlert title="Noticias no disponibles" message={error} />
      ) : loading ? (
        <p className={styles.noNewsMessage}>Cargando noticias...</p>
      ) : latestNews.length > 0 ? (
        <NewsCarrousel>
          {latestNews.map((news) => (
            <NewCard
              key={news.id}
              id={news.id.toString()}
              title={news.titulo}
              date={formatDateToSpanish(
                news.fecha_publicacion ?? news.creado,
              )}
              image={news.recurso_principal?.url ?? DEFAULT_NEWS_IMAGE}
            />
          ))}
        </NewsCarrousel>
      ) : (
        <p className={styles.noNewsMessage}>
          No hay noticias disponibles por el momento.
        </p>
      )}
    </>
  );
}
