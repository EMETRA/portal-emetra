"use client";

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
  label,
  children,
  variant,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button, // Aplicación de estilos básicos del botón.
        variant && styles[variant], // Si se proporciona una variante, aplicar estilos de variante.
        className // Aplicar clases adicionales.
      )}
      {...props} // Pasar todas las demás props al elemento de botón.
    >
      {label} {/* Renderizar el texto del botón.*/}
      {children} {/* Renderizar los elementos hijos del botón. */}
    </button>
  );
};

export default Button;
