/*
  Categorías de cobro (CAS-132). La API manda `chargeType` como texto libre, sin catálogo
  (Daniel, 2026-11-11), así que las pantallas muestran el tipo que venga sin depender de una
  lista fija:
  - Etiqueta: si el tipo está en TIPOS_CONOCIDOS se usa su texto; si no, el mismo código
    hecho legible ("MULTA_CEPO" → "Multa cepo").
  - Color: los tipos conocidos usan su color del diseño; uno nuevo toma uno de los colores
    del diseño según su texto, siempre el mismo para el mismo tipo.
  Los filtros y el desglose del vehículo se arman con los tipos que traen los cobros.
*/

/** Colores de categoría del diseño (clases de CategoryBadge.module.scss). */
export const COLORES_CATEGORIA = ["transito", "administrativo", "cepo", "convenio", "tasas"] as const;
export type ColorCategoria = (typeof COLORES_CATEGORIA)[number];

/**
 * Tipos de cobro con texto y color definidos. Agregar aquí un tipo nuevo solo mejora su
 * etiqueta; sin esto igual se muestra.
 */
const TIPOS_CONOCIDOS: Record<string, { etiqueta: string; color: ColorCategoria }> = {
    // Se han visto los dos códigos (API y Swagger) para la remisión de tránsito.
    REMISION: { etiqueta: "Tránsito", color: "transito" },
    REMISION_TRANSITO: { etiqueta: "Tránsito", color: "transito" },
};

/** "MULTA_DE_CEPO" → "Multa de cepo". */
function codigoLegible(codigo: string): string {
    const texto = codigo.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function etiquetaCategoria(tipo: string): string {
    return TIPOS_CONOCIDOS[tipo]?.etiqueta ?? codigoLegible(tipo);
}

export function colorCategoria(tipo: string): ColorCategoria {
    const conocido = TIPOS_CONOCIDOS[tipo]?.color;
    if (conocido) return conocido;
    let suma = 0;
    for (const letra of tipo) suma = (suma * 31 + letra.charCodeAt(0)) >>> 0;
    return COLORES_CATEGORIA[suma % COLORES_CATEGORIA.length];
}

export type CategoriaCobro = { value: string; label: string };

/** Categorías distintas de una lista de cobros, en el orden en que aparecen. */
export function categoriasDe(cobros: { category?: string }[]): CategoriaCobro[] {
    const vistas = new Map<string, CategoriaCobro>();
    for (const { category } of cobros) {
        if (category && !vistas.has(category)) {
            vistas.set(category, { value: category, label: etiquetaCategoria(category) });
        }
    }
    return [...vistas.values()];
}
