import "server-only";

import { NextRequest, NextResponse } from "next/server";
import {
  buildBackendUrl,
  buildProxyUpstreamHeaders,
} from "@/lib/backend/client";
import {
  buildUpstreamDebugContext,
  fetchUpstream,
  formatUpstreamFetchError,
} from "@/lib/backend/fetch-upstream";

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

export type ProxyBackendOptions = {
  /** Backend path, optionally with query string (e.g. `/routes?page=1`). */
  path: string;
  method?: string;
  /** Defaults to true for methods other than GET and HEAD. */
  forwardBody?: boolean;
};

/**
 * Forwards the incoming request to the backend and returns the response as-is
 * (status, headers, and body). Backend error payloads are not rewritten.
 */
export async function proxyBackendRequest(
  req: NextRequest,
  options: ProxyBackendOptions
): Promise<NextResponse> {
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

  const headers = buildProxyUpstreamHeaders(req.headers, body);
  const targetUrl = buildBackendUrl(options.path);

  let backendResponse: Response;
  try {
    backendResponse = await fetchUpstream(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error) {
    console.error("[proxyBackendRequest] network error:", {
      path: options.path,
      targetUrl,
      detail: formatUpstreamFetchError(error),
    });
    const debugBody = [
      formatUpstreamFetchError(error),
      "",
      buildUpstreamDebugContext(targetUrl),
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
