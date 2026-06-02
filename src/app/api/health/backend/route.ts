import { NextResponse } from "next/server";
import { buildBackendHeaders, buildBackendUrl } from "@/lib/backend/client";
import {
  buildUpstreamDebugContext,
  fetchUpstream,
  formatUpstreamFetchError,
} from "@/lib/backend/fetch-upstream";

/**
 * Comprueba conectividad portal (contenedor) -> backend.
 * GET /api/health/backend
 */
export async function GET() {
  const targetUrl = buildBackendUrl("/news?limit=1");

  try {
    const response = await fetchUpstream(targetUrl, {
      method: "GET",
      headers: buildBackendHeaders(),
      cache: "no-store",
    });
    const bodyPreview = (await response.text()).slice(0, 500);

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      targetUrl,
      bodyPreview,
      context: buildUpstreamDebugContext(targetUrl),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: formatUpstreamFetchError(error),
        targetUrl,
        context: buildUpstreamDebugContext(targetUrl),
        hint: "Ejecuta dentro del contenedor: docker exec -it portal-prod curl -v \"" + targetUrl + "\"",
      },
      { status: 502 }
    );
  }
}
