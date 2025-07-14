import React from "react";
import styles from "./Separator.module.scss";
import classNames from "classnames";
import { SeparatorProps } from "./types";

/**
 * Componente de separador
 * @returns {JSX.Element} Separador
 */
const Separator: React.FC<SeparatorProps> = ({
  variant = "default",
  className,
  ...rest
}) => (
  <div className={classNames(styles.Container, className)} {...rest}>
    <div
      className={classNames(
        styles.Separator,
        variant === "green" && styles.green
      )}
    />
  </div>
);

export default Separator;
