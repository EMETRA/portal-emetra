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

export function setCasilleroAuthCookie(
  response: NextResponse,
  token: string
): void {
  response.cookies.set({
    name: CASILLERO_AUTH_COOKIE_NAME,
    value: token,
    ...getCasilleroCookieOptions(COOKIE_MAX_AGE_SECONDS),
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
