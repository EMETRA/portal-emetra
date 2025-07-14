import React from "react";

/**
 * Propiedades del átomo Icon.
 * @interface IconProps
 * @extends {React.HTMLAttributes<HTMLSpanElement>}
 * @param {string} src - - URL del SVG a usar como máscara.
 * @param {string} [className] - Clase(s) adicional(es).
 */
interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    src: string;
    className?: string;
}

export type { IconProps };
