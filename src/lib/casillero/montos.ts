/*
  Montos de Cobros (CAS-132). La API manda los montos como texto decimal exacto ("100",
  "125.50") para no perder centavos. Aquí se convierten a centavos enteros, se suman en
  centavos y solo al final se pasan a quetzales o a texto. Sumar decimales directamente
  da errores como 0.1 + 0.2 = 0.30000000000000004.
  Sin dependencias de navegador ni de servidor: lo usan las pantallas y las simulaciones.
*/

const MONTO_DECIMAL = /^(\d+)(?:\.(\d+))?$/;

/**
 * "125.50" → 12550. Lee el texto sin pasar por parseFloat. Con más de dos decimales
 * redondea al centavo (mitad hacia arriba). null si el texto no es un monto válido.
 */
export function montoACentavos(texto: string | null | undefined): number | null {
  const match = MONTO_DECIMAL.exec((texto ?? "").trim());
  if (!match) return null;
  const [, enteros, decimales = ""] = match;
  const dosDecimales = Number(decimales.slice(0, 2).padEnd(2, "0"));
  const redondeo = decimales.length > 2 && Number(decimales[2]) >= 5 ? 1 : 0;
  const centavos = Number(enteros) * 100 + dosDecimales + redondeo;
  return Number.isSafeInteger(centavos) ? centavos : null;
}

/** Quetzales con hasta dos decimales (100.5) → centavos (10050), sin error de redondeo. */
export const quetzalesACentavos = (quetzales: number): number => Math.round(quetzales * 100);

/** Suma montos en quetzales pasando por centavos; devuelve quetzales. */
export const sumarQuetzales = (montos: number[]): number =>
  montos.reduce((suma, monto) => suma + quetzalesACentavos(monto), 0) / 100;

/**
 * 350000 → "Q3,500"; 12550 → "Q125.50". Sin decimales cuando el monto es entero, como en
 * el diseño; con `siempreDecimales` se muestran siempre ("Q300.00"), útil en columnas de
 * montos para que queden alineados. Otra moneda que no sea GTQ se antepone con su código
 * ("USD 10").
 */
export function formatearMonto(centavos: number, moneda = "GTQ", siempreDecimales = false): string {
  const entero = !siempreDecimales && centavos % 100 === 0;
  const numero = (centavos / 100).toLocaleString("es-GT", {
    minimumFractionDigits: entero ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return moneda === "GTQ" ? `Q${numero}` : `${moneda} ${numero}`;
}

/** Igual que `formatearMonto`, pero a partir de quetzales. */
export const formatearQuetzales = (quetzales: number, moneda = "GTQ", siempreDecimales = false): string =>
  formatearMonto(quetzalesACentavos(quetzales), moneda, siempreDecimales);
