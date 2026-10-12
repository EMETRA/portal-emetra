export type AccionReporte = 'aceptar' | 'refutar';
export type EnlaceReporte = { accion: AccionReporte; aceptar: string | null; refutar: string | null };

/** Los tokens del fragmento nunca se envían al servidor al abrir la página. */
export function leerEnlaceReporte(fragmento: string): EnlaceReporte | null {
  if (fragmento.length > 500) return null;
  const valores = new URLSearchParams(fragmento.replace(/^#/, ''));
  if (['accion', 'aceptar', 'refutar'].some(clave => valores.getAll(clave).length > 1)) return null;
  const accion = valores.get('accion');
  if (accion !== 'aceptar' && accion !== 'refutar') return null;
  const aceptar = valores.get('aceptar');
  const refutar = valores.get('refutar');
  if ([aceptar, refutar].some(token => token !== null && !/^[A-Za-z0-9_-]{32,128}$/.test(token))) return null;
  if (!(accion === 'aceptar' ? aceptar : refutar)) return null;
  return { accion, aceptar, refutar };
}

export function comprobarCasoReporte(codigoRecibido: string, codigoEsperado?: string): void {
  if (codigoEsperado && codigoRecibido !== codigoEsperado) throw new Error('El enlace no corresponde al número de caso de esta página. Abre de nuevo el enlace del correo.');
}
