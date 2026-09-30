import "server-only";

import { getBackendBaseUrl } from "@/lib/backend/client";

function shouldSkipTlsVerify(): boolean {
  return process.env.BACKEND_TLS_INSECURE !== "0";
}

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

export async function fetchUpstream(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const useHttps = url.startsWith("https://");
  const skipTls = useHttps && shouldSkipTlsVerify();
  const previousTlsSetting = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

  if (skipTls) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  try {
    return await fetch(url, init);
  } finally {
    if (skipTls) {
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
    `BACKEND_TLS_INSECURE: ${process.env.BACKEND_TLS_INSECURE ?? "(unset, skip verify on https)"}`,
  ].join("\n");
}
