import "server-only";

import type { NextRequest } from "next/server";

export type UpstreamId = "portal" | "casillero";

export type UpstreamAuthContext = {
  req?: NextRequest;
  body?: ArrayBuffer | BodyInit | null;
};

export type UpstreamConfig = {
  id: UpstreamId;
  /** Env-facing label for debug messages (e.g. API_BASE_URL). */
  baseUrlEnvName: string;
  getBaseUrl: () => string;
  /**
   * Injects Authorization (and related) headers for this upstream.
   * Must never forward the browser's Authorization header.
   */
  applyAuth: (
    headers: Headers,
    ctx: UpstreamAuthContext
  ) => void | Promise<void>;
  /**
   * Name of the env var that controls TLS verify skip for this upstream.
   * Same semantics as today: unset or any value other than "0" skips verify on https.
   */
  tlsInsecureEnv: string;
};

export function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `http://${trimmed}`;
}

export function buildUpstreamUrl(config: UpstreamConfig, path: string): string {
  const base = config.getBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function shouldSkipTlsVerify(config: UpstreamConfig): boolean {
  return process.env[config.tlsInsecureEnv] !== "0";
}
