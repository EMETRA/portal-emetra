const ENTIDADES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
  "&amp;": "&",
};

/**
 * Convierte el contenido_html de una sección en párrafos de texto, cada uno con
 * sus líneas. Es el camino inverso de textToHtml de COM-03: <p> → párrafo,
 * <br> → línea. Cualquier otra etiqueta se descarta y solo se conserva su
 * texto, así que el resultado se puede pintar sin dangerouslySetInnerHTML.
 *
 * Ejemplo: "<p>Hola<br>mundo</p><p>Otro</p>" → [["Hola", "mundo"], ["Otro"]]
 */
export function htmlToParagraphs(html: string): string[][] {
  const texto = html
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(lt|gt|quot|#39|nbsp|amp);/g, (entidad) => ENTIDADES[entidad]);

  return texto
    .split(/\n\s*\n/)
    .map((parrafo) =>
      parrafo
        .split("\n")
        .map((linea) => linea.trim())
        .filter(Boolean)
    )
    .filter((lineas) => lineas.length > 0);
}
