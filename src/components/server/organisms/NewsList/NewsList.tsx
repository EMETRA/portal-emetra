"use client";

import React from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/server/atoms/Button";
import { SectionTitle } from "@/components/server/molecules/SectionTitle";
import { NewsCard } from "@/components/server/molecules/NewsCard";
import { NewsSkeleton } from "@/components/server/molecules/NewsSkeleton";
import { NewsStateCard } from "@/components/server/molecules/NewsStateCard";
import styles from "./NewsList.module.scss";
import { NewsListProps } from "./types";

/**
 * Listado de noticias publicadas (COM-04).
 * Desktop: carrusel paginado de 3 por página, con flechas laterales y puntos.
 * Mobile: cards apiladas con el control "‹ 1 / N ›" debajo.
 */
const NewsList: React.FC<NewsListProps> = ({
  status,
  noticias,
  page,
  totalPages,
  onPageChange,
  onRetry,
  getHref,
  pageSize = 3,
  className,
}) => {
  const hayPaginas = status === "ready" && totalPages > 1;
  const puedeAnterior = page > 1;
  const puedeSiguiente = page < totalPages;

  const flecha = (direccion: "prev" | "next", extraClass?: string) => {
    const esPrev = direccion === "prev";
    const Icono = esPrev ? ChevronLeft : ChevronRight;
    return (
      <button
        type="button"
        className={classNames(styles.arrow, extraClass)}
        onClick={() => onPageChange(esPrev ? page - 1 : page + 1)}
        disabled={esPrev ? !puedeAnterior : !puedeSiguiente}
        aria-label={esPrev ? "Noticias anteriores" : "Más noticias"}
      >
        <Icono aria-hidden="true" />
      </button>
    );
  };

  let contenido: React.ReactNode;
  if (status === "loading") {
    contenido = (
      <>
        <p className={styles.loadingText} role="status">
          Cargando noticias…
        </p>
        <div className={styles.grid}>
          {Array.from({ length: pageSize }, (_, index) => (
            <NewsSkeleton key={index} variant="card" />
          ))}
        </div>
      </>
    );
  } else if (status === "error") {
    contenido = (
      <NewsStateCard
        variant="error"
        title="No pudimos cargar las noticias"
        message="Ocurrió un problema de conexión. Intenta de nuevo en unos momentos."
      >
        <Button onClick={onRetry}>Reintentar</Button>
      </NewsStateCard>
    );
  } else if (status === "empty") {
    contenido = (
      <NewsStateCard
        variant="empty"
        title="Por ahora no hay noticias publicadas"
        message="Vuelve a consultar más adelante."
        wide
      />
    );
  } else {
    contenido = (
      <>
        <div className={styles.carousel}>
          {hayPaginas && flecha("prev", styles.desktopOnly)}
          <ul className={styles.grid}>
            {noticias.map((noticia) => (
              <li key={noticia.id}>
                <NewsCard noticia={noticia} href={getHref(noticia)} />
              </li>
            ))}
          </ul>
          {hayPaginas && flecha("next", styles.desktopOnly)}
        </div>

        {hayPaginas && (
          <nav className={styles.pagination} aria-label="Páginas de noticias">
            <ul className={classNames(styles.dots, styles.desktopOnly)}>
              {Array.from({ length: totalPages }, (_, index) => {
                const numero = index + 1;
                return (
                  <li key={numero}>
                    <button
                      type="button"
                      className={classNames(
                        styles.dot,
                        numero === page && styles.dotActive
                      )}
                      onClick={() => onPageChange(numero)}
                      aria-label={`Página ${numero}`}
                      aria-current={numero === page ? "page" : undefined}
                    />
                  </li>
                );
              })}
            </ul>
            <div className={classNames(styles.pager, styles.mobileOnly)}>
              {flecha("prev")}
              <span aria-live="polite">
                {page} / {totalPages}
              </span>
              {flecha("next")}
            </div>
          </nav>
        )}
      </>
    );
  }

  return (
    <div className={classNames(styles.list, className)}>
      <SectionTitle mobileUnderline>Noticias</SectionTitle>
      {contenido}
    </div>
  );
};

export default NewsList;
