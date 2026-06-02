import "server-only";

import { getBackendBaseUrl } from "@/lib/backend/client";

export function formatUpstreamFetchError(error: unknown): string {
  const lines: string[] = [];
  let current: unknown = error;
  let depth = 0;

  while (current != null && depth < 6) {
    if (current instanceof Error) {
      lines.push(current.message);
      const errno = current as NodeJS.ErrnoException;
      if (errno.code) {
        lines.push(`code=${errno.code}`);
      }
      current = current.cause;
    } else {
      lines.push(String(current));
      break;
    }
    depth += 1;
  }

  return lines.filter(Boolean).join(" | ");
}

/**
 * fetch del servidor (Node) hacia el backend.
 * IPv4: NODE_OPTIONS=--dns-result-order=ipv4first (ver docker-compose).
 * TLS: ca-certificates en la imagen Docker; solo diagnostico BACKEND_TLS_INSECURE=1.
 */
export async function fetchUpstream(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const tlsInsecure = process.env.BACKEND_TLS_INSECURE === "1";
  const previousTlsSetting = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

  if (tlsInsecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  try {
    return await fetch(url, init);
  } finally {
    if (tlsInsecure) {
      if (previousTlsSetting === undefined) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      } else {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsSetting;
      }
    }
  }
}

export function buildUpstreamDebugContext(targetUrl: string): string {
  return [
    `target: ${targetUrl}`,
    `API_BASE_URL: ${getBackendBaseUrl()}`,
    `NODE_OPTIONS: ${process.env.NODE_OPTIONS ?? "(unset)"}`,
    `BACKEND_TLS_INSECURE: ${process.env.BACKEND_TLS_INSECURE ?? "(unset)"}`,
  ].join("\n");
}
