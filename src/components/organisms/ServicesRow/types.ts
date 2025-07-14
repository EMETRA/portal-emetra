// src/components/organisms/ServicesRow/types.ts
import React from "react";

/**
 * Props de ServicesRow.
 *
 * @interface ServicesRowProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @param {string} [className] - Clases adicionales para el contenedor.
 */
interface ServicesRowProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export type { ServicesRowProps };
