import "server-only";

import {
  shouldSkipTlsVerify,
  type UpstreamConfig,
} from "@/lib/backend/upstream";

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
  init?: RequestInit,
  config?: UpstreamConfig
): Promise<Response> {
  const useHttps = url.startsWith("https://");
  const skipTls =
    useHttps &&
    (config ? shouldSkipTlsVerify(config) : process.env.BACKEND_TLS_INSECURE !== "0");
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

export function buildUpstreamDebugContext(
  targetUrl: string,
  config?: UpstreamConfig
): string {
  if (config) {
    const tlsEnv = config.tlsInsecureEnv;
    return [
      `target: ${targetUrl}`,
      `upstream: ${config.id}`,
      `${config.baseUrlEnvName}: ${config.getBaseUrl()}`,
      `${tlsEnv}: ${process.env[tlsEnv] ?? "(unset, skip verify on https)"}`,
    ].join("\n");
  }

  return [
    `target: ${targetUrl}`,
    `BACKEND_TLS_INSECURE: ${process.env.BACKEND_TLS_INSECURE ?? "(unset, skip verify on https)"}`,
  ].join("\n");
}
