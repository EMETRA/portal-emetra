import "server-only";

/**
 * URL del API backend. Solo el servidor Next (rutas /api/*) debe usarla.
 * El navegador no tiene acceso de red al backend; solo llama a /api/...
 */
export const API_BASE_URL =
  process.env.API_BASE_URL?.trim() || "http://api-emetra.muniguate.com";
