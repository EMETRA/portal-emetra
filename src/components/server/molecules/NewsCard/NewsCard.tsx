import React from "react";
import Link from "next/link";
import classNames from "classnames";
import { Icon } from "@/components/server/atoms/Icon";
import { NewsMedia } from "@/components/server/molecules/NewsMedia";
import { formatNewsDate } from "@/helpers/formatNewsDate";
import styles from "./NewsCard.module.scss";
import { NewsCardProps } from "./types";

/**
 * Card del listado de noticias (COM-04): portada, título, fecha, autor,
 * resumen y "Leer más →". Toda la card es el enlace al detalle.
 */
const NewsCard: React.FC<NewsCardProps> = ({ noticia, href, className }) => {
  const fecha = formatNewsDate(noticia.fechaPublicacion);

  return (
    <Link href={href} className={classNames(styles.card, className)}>
      <NewsMedia recurso={noticia.recursoPrincipal} variant="tarjeta" />
      <div className={styles.body}>
        <h3 className={styles.title}>{noticia.titulo}</h3>
        {fecha && (
          <span className={styles.date}>
            <Icon name="Calendar" className={styles.icon} aria-hidden="true" />
            {fecha}
          </span>
        )}
        {noticia.autor && (
          <span className={styles.author}>Por {noticia.autor}</span>
        )}
        {noticia.resumen && <p className={styles.summary}>{noticia.resumen}</p>}
        <span className={styles.more}>Leer más →</span>
      </div>
    </Link>
  );
};

export default NewsCard;
