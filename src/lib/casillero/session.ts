import "server-only";

import type { NextResponse } from "next/server";
import { CASILLERO_AUTH_COOKIE_NAME } from "@/lib/casillero/constants";

export { CASILLERO_AUTH_COOKIE_NAME };

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

export function getCasilleroCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Segundos hasta `expiresAt` (ISO) de la sesión del backend. Sin fecha válida o ya
 * vencida, usa la duración por defecto.
 */
function maxAgeHasta(expiresAt?: string | null): number {
  if (!expiresAt) return COOKIE_MAX_AGE_SECONDS;
  const segundos = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  return Number.isFinite(segundos) && segundos > 0 ? segundos : COOKIE_MAX_AGE_SECONDS;
}

/**
 * Guarda el token de sesión en la cookie httpOnly (el navegador no puede leerlo).
 * `expiresAt` (opcional) hace que la cookie venza junto con la sesión del backend.
 */
export function setCasilleroAuthCookie(
  response: NextResponse,
  token: string,
  expiresAt?: string | null
): void {
  response.cookies.set({
    name: CASILLERO_AUTH_COOKIE_NAME,
    value: token,
    ...getCasilleroCookieOptions(maxAgeHasta(expiresAt)),
  });
}

export function clearCasilleroAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: CASILLERO_AUTH_COOKIE_NAME,
    value: "",
    ...getCasilleroCookieOptions(0),
  });
}

export function readCasilleroAuthTokenFromCookies(
  cookies: { get: (name: string) => { value: string } | undefined }
): string | null {
  const value = cookies.get(CASILLERO_AUTH_COOKIE_NAME)?.value?.trim();
  return value || null;
}
