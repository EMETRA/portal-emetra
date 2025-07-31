import React from "react";

/**
 * Propiedades del DividerVertical (línea vertical).
 * @interface DividerVerticalProps
 * @extends {React.HTMLAttributes<HTMLSpanElement>}
 * @param {string} [className] - Clase(s) adicional(es).
 */
interface DividerVerticalProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export type { DividerVerticalProps };
