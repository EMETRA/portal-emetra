import { NextRequest, NextResponse } from "next/server";
import { apiErrorFromUnknown } from "@/lib/api/errors";
import { fetchLatestNewsServer } from "@/lib/content/server";

export async function GET(request: NextRequest) {
  try {
    const estado = request.nextUrl.searchParams.get("estado") ?? "borrador";
    const visibilidad =
      request.nextUrl.searchParams.get("visibilidad") ?? "publica";
    const idioma = request.nextUrl.searchParams.get("idioma") ?? "es-GT";
    const page = request.nextUrl.searchParams.get("page") ?? "1";
    const limit = request.nextUrl.searchParams.get("limit") ?? "10";

    if (
      estado === "borrador" &&
      visibilidad === "publica" &&
      idioma === "es-GT" &&
      page === "1" &&
      limit === "10"
    ) {
      const items = await fetchLatestNewsServer();
      return NextResponse.json({ items, total: items.length, page: 1, limit: 10 });
    }

    const { backendFetch } = await import("@/lib/backend/client");
    const searchParams = new URLSearchParams({
      estado,
      visibilidad,
      idioma,
      page,
      limit,
    });
    const data = await backendFetch(`/news?${searchParams.toString()}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorFromUnknown(error, "No se pudieron cargar las noticias");
  }
}
