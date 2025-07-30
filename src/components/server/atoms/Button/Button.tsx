import React from "react";
import { ButtonProps } from "./types";
import styles from "./Button.module.scss";
import classNames from "classnames";

/**
 * Componente Button que renderiza un elemento de botón con estilo.
 * @param {string} label - El texto a mostrar dentro del botón.
 * @param {boolean} disabled - Indica si el botón está deshabilitado.
 * @param {ButtonVariant} variant - Estilo seleccionable de variante para el botón.
 * @param {string} className - Clases adicionales para aplicar al botón.
 * @param {ButtonProps} props - Las propiedades para el componente Button.
 * @param {React.ReactNode} children - Los elementos hijos a renderizar dentro del botón.
 */
const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        variant && styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
