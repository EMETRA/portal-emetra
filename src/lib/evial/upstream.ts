import "server-only";
import { request as requestHttp } from "node:http";
import { request as requestHttps } from "node:https";
import { Readable } from "node:stream";

/** TLS explícito por petición: otros proxies heredados cambian el ajuste global de Node. */
export function fetchEvialUpstream(
  url: string,
  init: {
    method: string;
    headers: Headers;
    body?: Uint8Array;
    signal: AbortSignal;
  },
): Promise<Response> {
  const target = new URL(url);
  if (
    !["http:", "https:"].includes(target.protocol) ||
    target.username ||
    target.password
  )
    return Promise.reject(new Error("EVIAL_UPSTREAM_INVALID"));
  return new Promise((resolve, reject) => {
    const request = (target.protocol === "https:" ? requestHttps : requestHttp)(
      target,
      {
        method: init.method,
        headers: Object.fromEntries(init.headers.entries()),
        rejectUnauthorized: true,
        signal: init.signal,
      },
      (response) => {
        const status = response.statusCode || 502;
        if (status >= 300 && status < 400) {
          response.resume();
          reject(new Error("EVIAL_UPSTREAM_REDIRECT"));
          return;
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(response.headers)) {
          if (value !== undefined)
            headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
        try {
          const empty = [204, 205].includes(status) || init.method === "HEAD";
          if (empty) response.resume();
          resolve(
            new Response(
              empty
                ? null
                : (Readable.toWeb(response) as ReadableStream<Uint8Array>),
              { status, headers },
            ),
          );
        } catch (error) {
          response.destroy();
          reject(error);
        }
      },
    );
    request.on("error", reject);
    request.setTimeout(30000, () =>
      request.destroy(new Error("EVIAL_UPSTREAM_TIMEOUT")),
    );
    if (init.body) request.write(init.body);
    request.end();
  });
}
