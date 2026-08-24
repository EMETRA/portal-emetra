import "server-only";

import type { NextRequest } from "next/server";
import {
  buildUpstreamUrl,
  type UpstreamAuthContext,
  type UpstreamConfig,
} from "@/lib/backend/upstream";
import { portalUpstream } from "@/lib/backend/upstreams";
import {
  fetchUpstream,
  formatUpstreamFetchError,
} from "@/lib/backend/fetch-upstream";

export { buildUpstreamUrl };

export class BackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "BackendError";
  }
}

/** Headers that must not be forwarded from the browser to the backend. */
const UPSTREAM_STRIP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  "cookie",
  "authorization",
]);

/** Safe request headers to forward from the BFF client call to the backend. */
const UPSTREAM_ALLOW_HEADERS = new Set([
  "accept",
  "accept-language",
  "content-type",
  "content-language",
  "if-match",
  "if-none-match",
  "if-modified-since",
  "if-unmodified-since",
  "cache-control",
]);

export function pickForwardRequestHeaders(incoming: Headers): Headers {
  const headers = new Headers();
  incoming.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      UPSTREAM_STRIP_HEADERS.has(lower) ||
      lower.startsWith("sec-") ||
      lower.startsWith("x-forwarded")
    ) {
      return;
    }
    if (UPSTREAM_ALLOW_HEADERS.has(lower)) {
      headers.set(key, value);
    }
  });
  return headers;
}

export function getBackendBaseUrl(): string {
  return portalUpstream.getBaseUrl();
}

export function buildBackendUrl(path: string): string {
  return buildUpstreamUrl(portalUpstream, path);
}

export async function buildUpstreamHeaders(
  config: UpstreamConfig,
  init?: RequestInit,
  ctx?: UpstreamAuthContext
): Promise<Headers> {
  const headers = new Headers(init?.headers);
  await config.applyAuth(headers, {
    req: ctx?.req,
    body: ctx?.body ?? init?.body ?? null,
  });
  return headers;
}

export async function buildBackendHeaders(
  init?: RequestInit
): Promise<Headers> {
  return buildUpstreamHeaders(portalUpstream, init);
}

export async function buildProxyUpstreamHeaders(
  config: UpstreamConfig,
  incoming: Headers,
  body?: ArrayBuffer | null,
  req?: NextRequest
): Promise<Headers> {
  const headers = pickForwardRequestHeaders(incoming);
  await config.applyAuth(headers, { req, body });
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return headers;
}

export async function fetchUpstreamRaw(
  config: UpstreamConfig,
  path: string,
  init?: RequestInit,
  ctx?: UpstreamAuthContext
): Promise<Response> {
  try {
    return await fetchUpstream(
      buildUpstreamUrl(config, path),
      {
        ...init,
        headers: await buildUpstreamHeaders(config, init, ctx),
        cache: init?.cache ?? "no-store",
      },
      config
    );
  } catch (error) {
    console.error(`[fetchUpstreamRaw:${config.id}] network error:`, path, error);
    throw new BackendError(
      formatUpstreamFetchError(error),
      503,
      "NETWORK_ERROR"
    );
  }
}

export async function fetchBackend(
  path: string,
  init?: RequestInit
): Promise<Response> {
  return fetchUpstreamRaw(portalUpstream, path, init);
}

async function readBackendErrorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const candidates = [body.message, body.error, body.detail, body.title];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
    if (Array.isArray(candidate) && candidate.length > 0) {
      const first = candidate[0];
      if (typeof first === "string") {
        return first;
      }
    }
  }

  return `Error del servicio (${response.status})`;
}

export async function upstreamFetch<T>(
  config: UpstreamConfig,
  path: string,
  init?: RequestInit,
  ctx?: UpstreamAuthContext
): Promise<T> {
  const response = await fetchUpstreamRaw(config, path, init, ctx);

  if (!response.ok) {
    throw new BackendError(
      await readBackendErrorMessage(response),
      response.status
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  return upstreamFetch<T>(portalUpstream, path, init);
}

export async function upstreamFetchText(
  config: UpstreamConfig,
  path: string,
  init?: RequestInit,
  ctx?: UpstreamAuthContext
): Promise<string> {
  const response = await fetchUpstreamRaw(config, path, init, ctx);

  if (!response.ok) {
    throw new BackendError(
      await readBackendErrorMessage(response),
      response.status
    );
  }

  return response.text();
}

export async function backendFetchText(
  path: string,
  init?: RequestInit
): Promise<string> {
  return upstreamFetchText(portalUpstream, path, init);
}
