import "server-only";

import { API_BASE_URL } from "@/lib/config";

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

function buildBackendUrl(path: string): string {
  return `${getBackendBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildBackendHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);
  const token = process.env.BACKEND_TOKEN?.trim();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return headers;
}

export async function fetchBackend(
  path: string,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetch(buildBackendUrl(path), {
      ...init,
      headers: buildBackendHeaders(init),
      cache: init?.cache ?? "no-store",
    });
  } catch (error) {
    console.error("[fetchBackend] network error:", path, error);
    throw new BackendError(
      "No se pudo conectar con el servicio",
      503,
      "NETWORK_ERROR"
    );
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
