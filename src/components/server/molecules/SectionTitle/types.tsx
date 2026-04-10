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
 */
interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  iconName?: IconType;
}

export type { SectionTitleProps };
