import React from "react";
import classNames from "classnames";
import { NewsMedia } from "@/components/server/molecules/NewsMedia";
import { NewsMeta } from "@/components/server/molecules/NewsMeta";
import { NewsGallery } from "@/components/server/organisms/NewsGallery";
import {
  buildNewsGallery,
  shouldShowNewsGallery,
} from "@/helpers/buildNewsGallery";
import { formatNewsDate } from "@/helpers/formatNewsDate";
import { htmlToParagraphs } from "@/helpers/newsHtml";
import type { NewsChip } from "@/lib/content/publishedNews.types";
import styles from "./NewsArticle.module.scss";
import { NewsArticleProps } from "./types";

/**
 * Detalle de una noticia publicada (COM-04): media principal, título, meta,
 * chips, secciones y "Galería y adjuntos" (solo si hay más de un recurso).
 */
const NewsArticle: React.FC<NewsArticleProps> = ({ noticia, className }) => {
  const chips = [
    noticia.categoria,
    noticia.subcategoria,
    ...noticia.etiquetas,
  ].filter((chip): chip is NewsChip => chip !== null);
  const galeria = buildNewsGallery(noticia);
  const secciones = [...noticia.secciones].sort((a, b) => a.orden - b.orden);

  return (
    <article className={classNames(styles.article, className)}>
      <NewsMedia
        recurso={noticia.recursoPrincipal}
        variant="principal"
        emptyText="Esta noticia no tiene imagen ni video."
      />

      <header className={styles.header}>
        <h1 className={styles.title}>{noticia.titulo}</h1>
        <NewsMeta
          autor={noticia.autor}
          fecha={formatNewsDate(noticia.fechaPublicacion)}
          tiempoLecturaMin={noticia.tiempoLectura}
        />
        {chips.length > 0 && (
          <ul className={styles.chips} aria-label="Categorías y etiquetas">
            {chips.map((chip, index) => (
              <li key={`${chip.id}-${index}`} className={styles.chip}>
                {chip.nombre}
              </li>
            ))}
          </ul>
        )}
      </header>

      {secciones.map((seccion) => (
        <section key={seccion.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{seccion.encabezado}</h2>
          {/* contenidoHtml se pasa a texto: no se inyecta HTML. */}
          {htmlToParagraphs(seccion.contenidoHtml).map((lineas, index) => (
            <p key={index} className={styles.paragraph}>
              {lineas.map((linea, lineaIndex) => (
                <React.Fragment key={lineaIndex}>
                  {lineaIndex > 0 && <br />}
                  {linea}
                </React.Fragment>
              ))}
            </p>
          ))}
          {seccion.recurso && (
            <NewsMedia
              recurso={seccion.recurso}
              variant="seccion"
              className={styles.sectionMedia}
            />
          )}
        </section>
      ))}

      {shouldShowNewsGallery(galeria) && <NewsGallery recursos={galeria} />}
    </article>
  );
};

export default NewsArticle;
