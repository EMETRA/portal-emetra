import React from "react";

/**
 * - empty: borde punteado e ícono de documento ("Por ahora no hay noticias…").
 * - error: círculo rojo con "!" (error de carga o noticia no disponible).
 */
type NewsStateCardVariant = "empty" | "error";

/**
 * Props de NewsStateCard.
 * @param {string} title - Título del estado.
 * @param {string} message - Texto de apoyo.
 * @param {React.ReactNode} [children] - Acciones (botones) debajo del texto.
 * @param {boolean} [wide] - Ocupa todo el ancho disponible (estado vacío en desktop).
 */
interface NewsStateCardProps {
  variant: NewsStateCardVariant;
  title: string;
  message: string;
  children?: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export type { NewsStateCardProps, NewsStateCardVariant };
