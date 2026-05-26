import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isAppAuthorizationEnabled,
  isValidAppToken,
} from "@/lib/auth/session";

const PUBLIC_PATHS = ["/auth"];

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

export function middleware(request: NextRequest) {
  if (!isAppAuthorizationEnabled()) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (isStaticPath(pathname) || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);
  if (isValidAppToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/auth";
  url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
