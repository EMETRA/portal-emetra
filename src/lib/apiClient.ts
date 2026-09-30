import axios from "axios";

/**
 * Cliente HTTP solo para rutas internas del portal (BFF).
 * No debe apuntar al backend externo.
 */
export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});
