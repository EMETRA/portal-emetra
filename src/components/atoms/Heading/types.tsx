import React from "react";

/**
 * Tipos de variante de encabezado.
 */
type HeadingVariant =
  | "Extra-Large"
  | "Large"
  | "Medium"
  | "Small"
  | "Extra-Small";

/**
 * Propiedades del componente Heading que extienden un encabezado normal de React.
 * @param {HeadingVariant} [variant="Medium"] - La variante del encabezado (Extra-Small, Small, Medium, Large, Extra-Large).
 * @param {React.ReactNode} children - Contenido del encabezado.
 * @param {string} [className] - Clase(s) adicional(es) para el encabezado.
 */
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: HeadingVariant;
  children: React.ReactNode;
  className?: string;
}

export type { HeadingProps, HeadingVariant };
