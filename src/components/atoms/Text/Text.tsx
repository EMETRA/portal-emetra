import React from "react";
import { TextProps } from "./types";
import styles from "./Text.module.scss";
import classNames from "classnames";

/**
 * Componente de texto reutilizable.
 * @param {TextProps} props - Las propiedades del componente.
 * @param {string} variant - La variante del texto (Large, Medium, Small).
 * @param {string} props.className - Clase CSS adicional para el texto.
 * @param {React.ReactNode} children - Contenido del texto.
 * @returns {JSX.Element} El componente de texto.
 */
const Text: React.FC<TextProps> = ({
  variant = "Medium",
  className,
  children,
  ...props
}) => {
  return (
    <p className={classNames(styles.text, variant && styles[variant], className)}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text;
