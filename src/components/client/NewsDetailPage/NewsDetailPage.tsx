"use client";

import Image from "next/image";
import classNames from "classnames";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/server/atoms";
import ServiceErrorAlert from "@/components/molecules/ServiceErrorAlert/ServiceErrorAlert";
import { fetchNewsByIdClient } from "@/lib/content/api";
import type { NewsDetailDto } from "@/lib/content/types";
import styles from "@/app/new/[id]/Page.module.scss";

function formatDateToSpanish(dateISO?: string | null) {
  if (!dateISO) {
    return null;
  }

  const format = new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return format.format(new Date(dateISO));
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [news, setNews] = useState<NewsDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const newsId = id;

    async function load() {
      try {
        setError(null);
        setNotFound(false);
        const data = await fetchNewsByIdClient(newsId);
        setNews(data);
      } catch (loadError) {
        if (
          loadError instanceof Error &&
          loadError.name === "NotFoundError"
        ) {
          setNotFound(true);
          setNews(null);
        } else {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la noticia."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Cargando noticia...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <ServiceErrorAlert
        title="Noticia no encontrada"
        message="La noticia solicitada no existe o ya no esta disponible."
      />
    );
  }

  if (error || !news) {
    return (
      <ServiceErrorAlert
        title="Noticia no disponible"
        message={error ?? "No se pudo cargar la noticia."}
      />
    );
  }

  const publicationDate = formatDateToSpanish(news.fecha_publicacion);
  const coverImage = news.recurso_principal?.url ?? "/images/Evento.jpg";

  const secciones = [
    {
      titulo: "Contenido",
      subtitulos: [
        {
          subtitulo: "Resumen",
          contenido:
            news.resumen ??
            "No hay un resumen disponible para esta noticia por el momento.",
        },
      ],
    },
    {
      titulo: "Categorias",
      subtitulos:
        news.categorias?.map((categoria) => ({
          subtitulo: categoria.nombre ?? "Categoria",
          contenido: `Slug: ${categoria.slug ?? "sin slug"}`,
        })) ?? [],
    },
    {
      titulo: "Etiquetas",
      subtitulos:
        news.etiquetas?.map((etiqueta) => ({
          subtitulo: etiqueta.nombre ?? "Etiqueta",
          contenido: `Slug: ${etiqueta.slug ?? "sin slug"}`,
        })) ?? [],
    },
  ].filter((section) => section.subtitulos.length > 0);

  return (
    <div>
      <main>
        <div className={classNames(styles.container)}>
          <div className={classNames(styles.imageContainer)}>
            <Image
              src={coverImage}
              alt={news.titulo}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={classNames(styles.content)}>
            <div>
              <h1>{news.titulo}</h1>
              <h2>No. {news.id}</h2>
              <div className={classNames(styles.dateContainer)}>
                <Icon
                  name="Calendar"
                  className={classNames(styles.calendarIcon)}
                />
                <h3 className={classNames(styles.dateTitle)}>
                  {publicationDate ?? "Fecha no disponible"}
                </h3>
              </div>
            </div>
            {news.resumen && <p>{news.resumen}</p>}
          </div>
        </div>

        {secciones.length > 0 && (
          <div className={classNames(styles.sections)}>
            {secciones.map((seccion, idx) => (
              <section key={idx} className={classNames(styles.section)}>
                <h2 className={classNames(styles.sectionTitle)}>
                  {seccion.titulo}
                </h2>
                {seccion.subtitulos.map((sub, subIdx) => (
                  <div key={subIdx} className={classNames(styles.subsection)}>
                    <h3 className={classNames(styles.sectionSubtitle)}>
                      {sub.subtitulo}
                    </h3>
                    <p className={classNames(styles.sectionContent)}>
                      {sub.contenido}
                    </p>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
