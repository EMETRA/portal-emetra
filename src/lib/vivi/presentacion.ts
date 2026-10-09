/** Datos públicos de presentación; nunca construye enlaces con tokens del trámite. */
export function coordenadasValidas(latitud: unknown, longitud: unknown): boolean {
  return typeof latitud === 'number' && Number.isFinite(latitud) && Math.abs(latitud) <= 90
    && typeof longitud === 'number' && Number.isFinite(longitud) && Math.abs(longitud) <= 180;
}

export function urlUbicacion(latitud: unknown, longitud: unknown): string | null {
  if (!coordenadasValidas(latitud, longitud)) return null;
  return `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=18/${latitud}/${longitud}`;
}

export function formatoMontoBase(monto: unknown): string {
  if (typeof monto !== 'number' || !Number.isFinite(monto) || monto < 0) return 'Por confirmar';
  return `Q ${new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monto)}`;
}
