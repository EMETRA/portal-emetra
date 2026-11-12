import type { LoginResponse, ResendResponse } from "@/lib/casillero/types";

/**
 * TODO [CASILLERO-BACKEND]: simulación del acceso para probar las pantallas sin la API.
 * true = las rutas del BFF de login, segundo factor y reenvío responden sin llamar al
 * backend, y el segundo factor crea una sesión simulada (cookie httpOnly).
 * Debe quedar en false en lo que se sube: con true cualquiera entra al dashboard.
 *
 * En el segundo factor, el código "000000" simula un código inválido (401); en
 * "olvidé mi contraseña", el token "000000" simula un token inválido (401).
 */
export const SIMULAR_AUTH = false;

/** Token de recuperación que en simulación responde "token inválido" (401). */
export const TOKEN_RECUPERACION_INVALIDO_SIMULADO = "000000";

/** Valor de la cookie de la sesión simulada. */
export const TOKEN_SESION_SIMULADA = "sesion-simulada";

/** Código que en simulación responde "código inválido". */
export const CODIGO_INVALIDO_SIMULADO = "000000";

const MINUTOS_RETO = 10;

const venceEn = (minutos: number) => new Date(Date.now() + minutos * 60 * 1000).toISOString();

/** Respuesta de POST /v1/auth/login con los tres factores. */
export function loginSimulado(): LoginResponse {
  return {
    challengeId: "reto-simulado",
    expiresAt: venceEn(MINUTOS_RETO),
    availableFactors: [
      { id: "501", type: "CORREO", preferred: true, destinationMasked: "p***@correo.com" },
      { id: "502", type: "TOTP", preferred: false },
      { id: "503", type: "RECUPERACION", preferred: false },
    ],
  };
}

/** Respuesta de POST /v1/auth/challenges/{id}/resend. */
export function reenvioSimulado(challengeId: string): ResendResponse {
  return {
    challengeId,
    expiresAt: venceEn(MINUTOS_RETO),
    destinationMasked: "p***@correo.com",
  };
}

/** Vencimiento de la sesión simulada (30 minutos). */
export function vencimientoSesionSimulada(): string {
  return venceEn(30);
}
