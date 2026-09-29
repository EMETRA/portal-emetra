import React from "react";
import classNames from "classnames";
import styles from "./NewsSkeleton.module.scss";
import { NewsSkeletonProps } from "./types";

/**
 * Esqueletos de carga de COM-04. Son decorativos: el texto "Cargando…" lo
 * pone el contenedor.
 */
const NewsSkeleton: React.FC<NewsSkeletonProps> = ({ variant, className }) => {
  if (variant === "card") {
    return (
      <div className={classNames(styles.card, className)} aria-hidden="true">
        <div className={classNames(styles.block, styles.cardMedia)} />
        <div className={styles.cardBody}>
          <div className={classNames(styles.line, styles.w80)} />
          <div className={classNames(styles.line, styles.w50)} />
          <div className={classNames(styles.block, styles.cardText)} />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.detail, className)} aria-hidden="true">
      <div className={styles.detailTop}>
        <div className={classNames(styles.block, styles.detailMedia)} />
        <div className={styles.detailInfo}>
          <div className={classNames(styles.line, styles.lineTall, styles.w60)} />
          <div className={styles.row}>
            <div className={classNames(styles.line, styles.w25)} />
            <div className={classNames(styles.line, styles.w25)} />
          </div>
          <div className={classNames(styles.line, styles.w100)} />
          <div className={classNames(styles.line, styles.w100)} />
          <div className={classNames(styles.line, styles.w90)} />
          <div className={classNames(styles.line, styles.w60)} />
        </div>
      </div>
      <div className={styles.detailCard}>
        <div className={classNames(styles.line, styles.w25)} />
        <div className={classNames(styles.line, styles.w100)} />
        <div className={classNames(styles.line, styles.w80)} />
      </div>
    </div>
  );
};

export default NewsSkeleton;
