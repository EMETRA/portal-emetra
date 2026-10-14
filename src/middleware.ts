import { NextRequest, NextResponse } from "next/server";
import { CASILLERO_AUTH_COOKIE_NAME } from "@/lib/casillero/constants";
import {
  AUTH_COOKIE_NAME,
  isAppAuthorizationEnabled,
  isValidAppToken,
} from "@/lib/auth/session";

const PUBLIC_PATHS = ["/auth"];

/**
 * Rutas del BFF de casillero que no exigen sesión (la página de acceso es exactamente
 * `/casillero`). Deben coincidir con los route handlers que usan `requireAuth: false`.
 * `logout` es pública para poder borrar la cookie aunque la sesión ya haya vencido.
 */
const CASILLERO_PUBLIC_API_PATHS = [
  "/api/casillero/auth/login",
  "/api/casillero/auth/challenges",
  "/api/casillero/auth/logout",
  "/api/casillero/auth/password-resets",
  "/api/casillero/auth/password",
  "/api/casillero/registrations",
  "/api/casillero/contact-verifications",
  "/api/casillero/health",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico"
  );
}

function isCasilleroPublicPath(pathname: string): boolean {
  if (pathname === "/casillero") {
    return true;
  }
  return CASILLERO_PUBLIC_API_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isCasilleroProtectedPath(pathname: string): boolean {
  if (pathname.startsWith("/api/casillero")) {
    return !isCasilleroPublicPath(pathname);
  }
  if (!pathname.startsWith("/casillero")) {
    return false;
  }
  return pathname !== "/casillero";
}

function getTokenFromRequest(request: NextRequest): string | null {
  const fromCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (fromCookie) {
    return fromCookie;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  const [scheme, value] = authHeader.split(" ");
  if (scheme.toLowerCase() !== "bearer" || !value) {
    return null;
  }

  return value;
}

function hasCasilleroSession(request: NextRequest): boolean {
  const token = request.cookies.get(CASILLERO_AUTH_COOKIE_NAME)?.value?.trim();
  return Boolean(token);
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  if (isAppAuthorizationEnabled()) {
    if (!isPublicPath(pathname)) {
      const token = getTokenFromRequest(request);
      if (!isValidAppToken(token)) {
        if (pathname.startsWith("/api")) {
          return NextResponse.json(
            { error: "No autorizado", code: "UNAUTHORIZED" },
            { status: 401 }
          );
        }

        const url = request.nextUrl.clone();
        url.pathname = "/auth";
        url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
        return NextResponse.redirect(url);
      }
    }
  }

  if (isCasilleroProtectedPath(pathname) && !hasCasilleroSession(request)) {
    if (pathname.startsWith("/api/casillero")) {
      return NextResponse.json(
        { error: "No autorizado", code: "CASILLERO_UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = "/casillero";
    url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
