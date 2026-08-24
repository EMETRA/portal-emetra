import "server-only";

/**
 * URL del API backend del portal. Solo el servidor Next (rutas /api/*) debe usarla.
 * El navegador no tiene acceso de red al backend; solo llama a /api/...
 */
export const API_BASE_URL =
  process.env.API_BASE_URL?.trim() || "http://EMETRA-panel.muniguate.com/web";

/**
 * URL del API de Casillero (upstream independiente). Solo el servidor Next
 * (rutas /api/casillero/*) debe usarla. El navegador solo llama a /api/casillero/...
 */
export const CASILLERO_API_BASE_URL =
  process.env.CASILLERO_API_BASE_URL?.trim() || "";
