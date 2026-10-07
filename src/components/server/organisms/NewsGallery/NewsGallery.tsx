"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Video from "@/components/server/atoms/Video/Video";
import { NewsMedia } from "@/components/server/molecules/NewsMedia";
import styles from "./NewsGallery.module.scss";
import { NewsGalleryProps } from "./types";

/**
 * "Galería y adjuntos" de COM-04: miniaturas de todas las imágenes y videos de
 * la noticia. Al hacer clic se abre un visor modal con flechas ‹ › para
 * recorrerlas; se cierra con X, Esc o clic fuera.
 */
const NewsGallery: React.FC<NewsGalleryProps> = ({ recursos, className }) => {
  const [abierto, setAbierto] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = recursos.length;

  const cerrar = useCallback(() => {
    setAbierto(null);
    triggerRef.current?.focus();
  }, []);

  const mover = useCallback(
    (paso: number) =>
      setAbierto((actual) =>
        actual === null ? null : (actual + paso + total) % total
      ),
    [total]
  );

  const estaAbierto = abierto !== null;

  // Solo al abrir o cerrar: teclado, bloqueo de scroll y foco inicial.
  useEffect(() => {
    if (!estaAbierto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cerrar();
      if (event.key === "ArrowLeft") mover(-1);
      if (event.key === "ArrowRight") mover(1);
    };
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [estaAbierto, cerrar, mover]);

  const actual = abierto === null ? null : recursos[abierto];

  return (
    <section className={classNames(styles.gallery, className)}>
      <h2 className={styles.title}>Galería y adjuntos</h2>
      <ul className={styles.grid}>
        {recursos.map((recurso, index) => (
          <li key={recurso.id}>
            <button
              type="button"
              className={styles.thumb}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setAbierto(index);
              }}
              aria-label={`Ver ${
                recurso.tipo === "video" ? "video" : "imagen"
              } ${index + 1} de ${total}`}
            >
              <NewsMedia recurso={recurso} variant="miniatura" />
            </button>
          </li>
        ))}
      </ul>

      {actual && abierto !== null && (
        <div
          className={styles.overlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) cerrar();
          }}
        >
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Galería de la noticia"
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={cerrar}
              aria-label="Cerrar galería"
            >
              <X aria-hidden="true" />
            </button>

            <div className={styles.stage}>
              {actual.tipo === "video" ? (
                <Video
                  key={actual.id}
                  src={actual.url}
                  width="100%"
                  height="100%"
                  privacyEnhanced
                  title={actual.textoAlternativo ?? "Video de YouTube"}
                />
              ) : (
                <Image
                  key={actual.id}
                  src={actual.url}
                  alt={actual.textoAlternativo ?? ""}
                  fill
                  sizes="90vw"
                  className={styles.image}
                />
              )}
            </div>

            {(actual.pieImagen || actual.creditos) && (
              <div className={styles.caption}>
                {actual.pieImagen && <span>{actual.pieImagen}</span>}
                {actual.creditos && (
                  <span className={styles.credits}>{actual.creditos}</span>
                )}
              </div>
            )}

            {total > 1 && (
              <div className={styles.nav}>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => mover(-1)}
                  aria-label="Anterior"
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <span className={styles.counter} aria-live="polite">
                  {abierto + 1} / {total}
                </span>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => mover(1)}
                  aria-label="Siguiente"
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsGallery;
