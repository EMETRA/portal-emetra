import "server-only";

import { NextRequest, NextResponse } from "next/server";
import {
  buildProxyUpstreamHeaders,
  buildUpstreamUrl,
} from "@/lib/backend/client";
import {
  buildUpstreamDebugContext,
  fetchUpstream,
  formatUpstreamFetchError,
} from "@/lib/backend/fetch-upstream";
import type { UpstreamConfig } from "@/lib/backend/upstream";
import { portalUpstream } from "@/lib/backend/upstreams";
import { readCasilleroAuthTokenFromCookies } from "@/lib/casillero/session";

const HOP_BY_HOP_HEADERS = new Set([
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
]);

function copyResponseHeaders(source: Headers, target: Headers): void {
  source.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      target.set(key, value);
    }
  });
}

export type ProxyUpstreamOptions = {
  /** Backend path, optionally with query string (e.g. `/routes?page=1`). */
  path: string;
  method?: string;
  /** Defaults to true for methods other than GET and HEAD. */
  forwardBody?: boolean;
  /**
   * When true, require an auth token for this upstream before calling it.
   * For casillero this means the httpOnly session cookie must be present.
   */
  requireAuth?: boolean;
};

export type ProxyBackendOptions = ProxyUpstreamOptions;

/**
 * Mediador genérico: el navegador solo habla con /api/*; este servidor reenvía
 * al upstream configurado y devuelve la respuesta tal cual.
 */
export async function proxyUpstreamRequest(
  config: UpstreamConfig,
  req: NextRequest,
  options: ProxyUpstreamOptions
): Promise<NextResponse> {
  if (options.requireAuth && config.id === "casillero") {
    const token = readCasilleroAuthTokenFromCookies(req.cookies);
    if (!token) {
      return NextResponse.json(
        { error: "No autorizado", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
  }

  const method = options.method ?? req.method;
  const forwardBody =
    options.forwardBody ?? !["GET", "HEAD"].includes(method.toUpperCase());

  let body: ArrayBuffer | undefined;
  if (forwardBody) {
    const buffer = await req.arrayBuffer();
    if (buffer.byteLength > 0) {
      body = buffer;
    }
  }

  const headers = await buildProxyUpstreamHeaders(
    config,
    req.headers,
    body,
    req
  );
  const targetUrl = buildUpstreamUrl(config, options.path);

  let backendResponse: Response;
  try {
    backendResponse = await fetchUpstream(
      targetUrl,
      {
        method,
        headers,
        body,
        cache: "no-store",
      },
      config
    );
  } catch (error) {
    console.error(`[proxyUpstreamRequest:${config.id}] network error:`, {
      path: options.path,
      targetUrl,
      detail: formatUpstreamFetchError(error),
    });
    const debugBody = [
      formatUpstreamFetchError(error),
      "",
      buildUpstreamDebugContext(targetUrl, config),
    ].join("\n");
    return new NextResponse(debugBody, {
      status: 502,
      statusText: "Bad Gateway",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const responseHeaders = new Headers();
  copyResponseHeaders(backendResponse.headers, responseHeaders);

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

/**
 * Mediador portal: el navegador solo habla con /api/*; este servidor reenvía
 * al backend del portal y devuelve la respuesta tal cual.
 */
export async function proxyBackendRequest(
  req: NextRequest,
  options: ProxyBackendOptions
): Promise<NextResponse> {
  return proxyUpstreamRequest(portalUpstream, req, options);
}

/** Appends the incoming request query string to a backend path. */
export function backendPathWithRequestQuery(
  req: NextRequest,
  backendPath: string
): string {
  const query = req.nextUrl.search;
  if (!query) {
    return backendPath;
  }
  return backendPath.includes("?")
    ? `${backendPath}&${query.slice(1)}`
    : `${backendPath}${query}`;
}

export const upstreamPathWithRequestQuery = backendPathWithRequestQuery;
