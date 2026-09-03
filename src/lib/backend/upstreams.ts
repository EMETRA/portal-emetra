import "server-only";

import { API_BASE_URL, CASILLERO_API_BASE_URL } from "@/lib/config.server";
import { readCasilleroAuthTokenFromCookies } from "@/lib/casillero/session";
import {
  normalizeBaseUrl,
  type UpstreamAuthContext,
  type UpstreamConfig,
} from "@/lib/backend/upstream";

function applyContentTypeIfNeeded(
  headers: Headers,
  body?: BodyInit | ArrayBuffer | null
): void {
  const hasBody =
    body !== undefined &&
    body !== null &&
    !(typeof body === "string" && body.length === 0) &&
    !(body instanceof ArrayBuffer && body.byteLength === 0);
  if (!headers.has("Content-Type") && hasBody) {
    headers.set("Content-Type", "application/json");
  }
}

function applyPortalAuth(
  headers: Headers,
  ctx: UpstreamAuthContext
): void {
  const token = process.env.BACKEND_TOKEN?.trim();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  applyContentTypeIfNeeded(headers, ctx.body);
}

function applyCasilleroAuth(
  headers: Headers,
  ctx: UpstreamAuthContext
): void {
  const token = ctx.req
    ? readCasilleroAuthTokenFromCookies(ctx.req.cookies)
    : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  applyContentTypeIfNeeded(headers, ctx.body);
}

export const portalUpstream: UpstreamConfig = {
  id: "portal",
  baseUrlEnvName: "API_BASE_URL",
  getBaseUrl: () => normalizeBaseUrl(API_BASE_URL),
  applyAuth: applyPortalAuth,
  tlsInsecureEnv: "BACKEND_TLS_INSECURE",
};

export const casilleroUpstream: UpstreamConfig = {
  id: "casillero",
  baseUrlEnvName: "CASILLERO_API_BASE_URL",
  getBaseUrl: () => normalizeBaseUrl(CASILLERO_API_BASE_URL),
  applyAuth: applyCasilleroAuth,
  tlsInsecureEnv: "CASILLERO_TLS_INSECURE",
};
