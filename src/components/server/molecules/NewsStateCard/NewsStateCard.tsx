import React from "react";
import classNames from "classnames";
import { FileText } from "lucide-react";
import styles from "./NewsStateCard.module.scss";
import { NewsStateCardProps } from "./types";

/**
 * Card de estado de COM-04: sin noticias, error de carga o noticia no disponible.
 */
const NewsStateCard: React.FC<NewsStateCardProps> = ({
  variant,
  title,
  message,
  children,
  wide = false,
  className,
}) => (
  <div
    className={classNames(
      styles.card,
      styles[variant],
      wide && styles.wide,
      className
    )}
    role={variant === "error" ? "alert" : "status"}
  >
    {variant === "error" ? (
      <span className={styles.errorIcon} aria-hidden="true">
        !
      </span>
    ) : (
      <FileText className={styles.emptyIcon} aria-hidden="true" />
    )}
    <p className={styles.title}>{title}</p>
    <p className={styles.message}>{message}</p>
    {children && <div className={styles.actions}>{children}</div>}
  </div>
);

export default NewsStateCard;
