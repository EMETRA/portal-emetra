import React from "react";

/**
 * Propiedades del componente Image.
 * @interface ImageProps
 * @extends {React.ImgHTMLAttributes<HTMLImageElement>}
 * @property {string} [src] - Ruta de la imagen.
 * @property {string} [alt] - Texto alternativo de la imagen.
 */

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement>{

}

export type { ImageProps };