import React from "react";
import type { IconType } from "../../atoms";
/**
 * Props de SectionTitle.
 *
 * @interface SectionTitleProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @param {React.ReactNode} children - Texto del título.
 * @param {string} [className] - Clases adicionales.
 * @param {string} [iconName] - Nombre del icono (opcional).
 * @param {boolean} [mobileUnderline] - Por debajo de $breakpoint-desktop, alinea
 * el título a la izquierda con un subrayado verde en lugar de las líneas laterales
 * ("Título - Mobile" del Figma). Por defecto false.
 */
interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  iconName?: IconType;
  mobileUnderline?: boolean;
}

export type { SectionTitleProps };
