import React from "react";

/**
 * Props de ServiceItem (dos iconos + etiqueta).
 *
 * @interface ServiceItemProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @param {string} iconA       - Ruta al primer SVG de icono.
 * @param {string} iconB       - Ruta al segundo SVG de icono.
 * @param {string} label       - Texto del servicio.
 * @param {string} [className] - Clase(s) adicional(es).
 */
interface ServiceItemProps extends React.HTMLAttributes<HTMLDivElement> {
    iconA: string;
    iconB: string;
    label: string;
    className?: string;
}

export type { ServiceItemProps };
