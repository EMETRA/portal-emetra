"use client";

import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { ImageIcon, Play } from "lucide-react";
import Video from "@/components/server/atoms/Video/Video";
import styles from "./NewsMedia.module.scss";
import { NewsMediaProps } from "./types";

/**
 * Imagen o video de una noticia, con los recuadros vacíos del diseño de COM-04.
 * El video muestra primero el recuadro oscuro con el botón de reproducir y
 * carga el reproductor al hacer clic (solo en la variante "principal").
 * TODO [COM04-BACKEND]: next/image solo acepta los hosts de
 * images.remotePatterns (hoy solo localhost). Agregar el host de los recursos
 * del CMS cuando backend lo confirme.
 */
const NewsMedia: React.FC<NewsMediaProps> = ({
  recurso,
  variant = "principal",
  emptyText,
  className,
}) => {
  const [playing, setPlaying] = useState(false);
  const rootClass = classNames(styles.media, styles[variant], className);

  if (!recurso) {
    if (!emptyText) {
      return <div className={classNames(rootClass, styles.blank)} />;
    }
    return (
      <div className={classNames(rootClass, styles.empty)}>
        <ImageIcon className={styles.emptyIcon} aria-hidden="true" />
        <span>{emptyText}</span>
      </div>
    );
  }

  if (recurso.tipo === "video") {
    if (playing) {
      return (
        <div className={classNames(rootClass, styles.player)}>
          <Video src={recurso.url} width="100%" height="100%" autoPlay />
        </div>
      );
    }

    const playIcon = (
      <span className={styles.playButton}>
        <Play className={styles.playIcon} aria-hidden="true" />
      </span>
    );

    if (variant !== "principal") {
      return (
        <div className={classNames(rootClass, styles.video)}>{playIcon}</div>
      );
    }

    return (
      <button
        type="button"
        className={classNames(rootClass, styles.video)}
        onClick={() => setPlaying(true)}
        aria-label={`Reproducir ${recurso.textoAlternativo ?? "video"}`}
      >
        {playIcon}
      </button>
    );
  }

  return (
    <div className={rootClass}>
      <Image
        src={recurso.url}
        alt={recurso.textoAlternativo ?? ""}
        fill
        sizes={variant === "miniatura" ? "160px" : "(max-width: 1400px) 100vw, 820px"}
        className={styles.image}
      />
    </div>
  );
};

export default NewsMedia;
