import React from "react";

/**
 * Propiedades del componente Hero:
 * @interface HeroProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @param {string} backgroundImage - URL de la imagen de fondo.
 * @param {string} text            - Texto largo que aparece en el overlay.
 * @param {[string,string]} [icons] - Etiquetas para los dos “iconos” (como texto).
 * @param {string} [className]     - Clase(s) adicional(es) para el contenedor.
 */
interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundImage: string;
  text: string;
  icons?: [string, string];
  className?: string;
}

export type { HeroProps };
