import React from "react";
import { LabelProps } from "./types";
import styles from "./Label.module.scss";
import classNames from "classnames";

/**
 * Componente de etiquetas.
 *
 * @param {LabelProps} props - Las propiedades del componente de etiqueta.
 * @returns {JSX.Element} El componente de etiqueta renderizado.
 */
const Label: React.FC<LabelProps> = ({
  className,
  children,
  variant,
  ...props
}) => {
  return (
    <label
      className={classNames(
        styles.label,
        variant && styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
