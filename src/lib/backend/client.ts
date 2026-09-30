import "server-only";

import { API_BASE_URL } from "@/lib/config.server";
import { fetchUpstream, formatUpstreamFetchError } from "@/lib/backend/fetch-upstream";

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

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `http://${trimmed}`;
}

export function getBackendBaseUrl(): string {
  return normalizeBaseUrl(API_BASE_URL);
}

export function buildBackendUrl(path: string): string {
  return `${getBackendBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
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

export function pickForwardRequestHeaders(
  incoming: Headers
): Headers {
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

export function buildBackendHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);
  applyBackendAuthHeaders(headers, init?.body);
  return headers;
}

export function buildProxyUpstreamHeaders(
  incoming: Headers,
  body?: ArrayBuffer | null
): Headers {
  const headers = pickForwardRequestHeaders(incoming);
  applyBackendAuthHeaders(headers, body);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return headers;
}

function applyBackendAuthHeaders(
  headers: Headers,
  body?: BodyInit | ArrayBuffer | null
): void {
  const token = process.env.BACKEND_TOKEN?.trim();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const hasBody =
    body !== undefined &&
    body !== null &&
    !(typeof body === "string" && body.length === 0) &&
    !(body instanceof ArrayBuffer && body.byteLength === 0);
  if (!headers.has("Content-Type") && hasBody) {
    headers.set("Content-Type", "application/json");
  }
}

export async function fetchBackend(
  path: string,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetchUpstream(buildBackendUrl(path), {
      ...init,
      headers: buildBackendHeaders(init),
      cache: init?.cache ?? "no-store",
    });
  } catch (error) {
    console.error("[fetchBackend] network error:", path, error);
    throw new BackendError(formatUpstreamFetchError(error), 503, "NETWORK_ERROR");
  }
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

export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetchBackend(path, init);

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

export async function backendFetchText(
  path: string,
  init?: RequestInit
): Promise<string> {
  const response = await fetchBackend(path, init);

  if (!response.ok) {
    throw new BackendError(
      await readBackendErrorMessage(response),
      response.status
    );
  }

  return response.text();
}
