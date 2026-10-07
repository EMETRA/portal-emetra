/**
 * Props de NewsMeta.
 * @param {string | null} autor - Nombre del autor; se muestra como "Por {autor}".
 * @param {string | null} fecha - Fecha ya formateada ("21 de septiembre del 2026").
 * @param {number | null} [tiempoLecturaMin] - Minutos de lectura; se omite si es null.
 */
interface NewsMetaProps {
  autor: string | null;
  fecha: string | null;
  tiempoLecturaMin?: number | null;
  className?: string;
}

export type { NewsMetaProps };
