"use client";

import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { ImageIcon, Play } from "lucide-react";
import Video from "@/components/server/atoms/Video/Video";
import styles from "./NewsMedia.module.scss";
import { NewsMediaProps } from "./types";

/** Variantes donde el video se puede reproducir ahí mismo. */
const REPRODUCIBLE = new Set(["principal", "seccion"]);

/**
 * Imagen o video de una noticia, con los recuadros vacíos del diseño de COM-04.
 * Los videos son de YouTube. Primero se ve el recuadro oscuro con el botón de
 * reproducir (decisión: no se usa la miniatura de YouTube) y, al hacer clic,
 * se carga el reproductor de youtube-nocookie.com, que arranca de una vez.
 * Solo se reproduce en "principal" y "seccion"; en la card y la miniatura,
 * el clic lo maneja el padre.
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
    // En las secciones el recuadro de imagen es bajo; un video necesita 16:9.
    const videoClass = classNames(
      rootClass,
      variant === "seccion" && styles.seccionVideo
    );

    if (playing) {
      return (
        <div className={classNames(videoClass, styles.player)}>
          <Video
            src={recurso.url}
            width="100%"
            height="100%"
            autoPlay
            privacyEnhanced
            title={recurso.textoAlternativo ?? "Video de YouTube"}
          />
        </div>
      );
    }

    const playIcon = (
      <span className={styles.playButton}>
        <Play className={styles.playIcon} aria-hidden="true" />
      </span>
    );

    if (!REPRODUCIBLE.has(variant)) {
      return (
        <div className={classNames(videoClass, styles.video)}>{playIcon}</div>
      );
    }

    return (
      <button
        type="button"
        className={classNames(videoClass, styles.video)}
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
