import React from "react";

/**
 * Props de SectionTitle.
 *
 * @interface SectionTitleProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @param {React.ReactNode} children - Texto del título.
 * @param {string} [className] - Clases adicionales.
 */
interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export type { SectionTitleProps };
