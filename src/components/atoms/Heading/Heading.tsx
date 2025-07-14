import React from "react";
import { HeadingProps, HeadingVariant  } from "./types";
import styles from "./Heading.module.scss";
import classNames from "classnames";

const variantClass: Record<HeadingVariant, string> = {
  "Extra-Large": styles.extraLarge,
  Large:         styles.large,
  Medium:        styles.medium,
  Small:         styles.small,
  "Extra-Small": styles.extraSmall,
};

/**
 * Componente de encabezado reutilizable.
 * @param {HeadingProps} props - Las propiedades del componente.
 * @param {string} variant - La variante del encabezado (Extra-Small, Small, Medium, Large, Extra-Large).
 * @param {string} className - Clase CSS adicional para el encabezado.
 * @param {React.ReactNode} dchildren - Contenido del encabezado.
 * @returns {JSX.Element} El componente de encabezado.
 */
const Heading: React.FC<HeadingProps> = ({
  variant = "Medium",
  children,
  className,
  ...rest
}) => (
  <h1
    className={classNames(styles.heading, 
      variantClass[variant], 
      className)}
    {...rest}
  >
    {children}
  </h1>
);

export default Heading;
