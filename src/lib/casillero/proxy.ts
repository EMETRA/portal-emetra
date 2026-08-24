import "server-only";

import type { NextRequest } from "next/server";
import {
  backendPathWithRequestQuery,
  proxyUpstreamRequest,
  type ProxyUpstreamOptions,
} from "@/lib/backend/proxy";
import { casilleroUpstream } from "@/lib/backend/upstreams";

export type ProxyCasilleroOptions = ProxyUpstreamOptions;

/**
 * Proxy hacia la API de Casillero. Auth de usuario se inyecta desde cookie httpOnly.
 */
export async function proxyCasilleroRequest(
  req: NextRequest,
  options: ProxyCasilleroOptions
): Promise<Response> {
  return proxyUpstreamRequest(casilleroUpstream, req, {
    ...options,
    requireAuth: options.requireAuth ?? true,
  });
}

export function casilleroPathWithRequestQuery(
  req: NextRequest,
  path: string
): string {
  return backendPathWithRequestQuery(req, path);
}
