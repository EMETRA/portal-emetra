import React from "react";
import classNames from "classnames";
import { Icon } from "@/components/server/atoms/Icon";
import styles from "./NewsMeta.module.scss";
import { NewsMetaProps } from "./types";

/**
 * Autor, fecha y tiempo de lectura de una noticia.
 * En desktop van en una línea; en mobile el autor va en su propia línea.
 */
const NewsMeta: React.FC<NewsMetaProps> = ({
  autor,
  fecha,
  tiempoLecturaMin,
  className,
}) => (
  <ul className={classNames(styles.meta, className)}>
    {autor && (
      <li className={classNames(styles.item, styles.author)}>
        <Icon name="User" className={styles.icon} aria-hidden="true" />
        Por {autor}
      </li>
    )}
    {fecha && (
      <li className={styles.item}>
        <Icon name="Calendar" className={styles.icon} aria-hidden="true" />
        {fecha}
      </li>
    )}
    {tiempoLecturaMin != null && tiempoLecturaMin > 0 && (
      <li className={styles.item}>
        <Icon name="Clock" className={styles.icon} aria-hidden="true" />
        {tiempoLecturaMin} min de lectura
      </li>
    )}
  </ul>
);

export default NewsMeta;
