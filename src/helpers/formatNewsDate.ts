const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Formatea la fecha de una noticia como "21 de septiembre del 2026".
 * Acepta "YYYY-MM-DD" (sin mover el día por la zona horaria) o una fecha ISO
 * completa, que se interpreta en hora de Guatemala.
 * Devuelve null si no hay fecha o no es válida.
 */
export function formatNewsDate(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  let year: number;
  let month: number;
  let day: number;

  const dateOnly = DATE_ONLY.exec(value);
  if (dateOnly) {
    year = Number(dateOnly[1]);
    month = Number(dateOnly[2]);
    day = Number(dateOnly[3]);
  } else {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    const parts = new Intl.DateTimeFormat("es-GT", {
      timeZone: "America/Guatemala",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((p) => p.type === type)?.value);
    year = part("year");
    month = part("month");
    day = part("day");
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  return `${day} de ${MESES[month - 1]} del ${year}`;
}
