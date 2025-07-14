// src/components/atoms/Separator/types.ts
import React from "react";

/**
 * Separador horizontal con variante de color.
 *
 * @interface SeparatorProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @param {"default" | "green"} [variant="default"] - Color del separador.
 * @param {string} [className] - Clase(s) adicional(es).
 */
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "green";
    className?: string;
}

export type { SeparatorProps };
