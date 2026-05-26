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

export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const token = process.env.BACKEND_TOKEN?.trim();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${getBackendBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
      cache: init?.cache ?? "no-store",
    });
  } catch (error) {
    console.error("[backendFetch] network error:", path, error);
    throw new BackendError(
      "No se pudo conectar con el servicio",
      503,
      "NETWORK_ERROR"
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
      code?: string;
    };
    throw new BackendError(
      body.message ?? `Error del servicio (${response.status})`,
      response.status,
      body.code
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
