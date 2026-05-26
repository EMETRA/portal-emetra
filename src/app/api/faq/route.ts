import { NextRequest, NextResponse } from "next/server";
import { apiErrorFromUnknown } from "@/lib/api/errors";
import { fetchFaqsServer } from "@/lib/content/server";

export async function GET(request: NextRequest) {
  try {
    const estado = request.nextUrl.searchParams.get("estado") ?? "activo";
    const page = request.nextUrl.searchParams.get("page") ?? "1";
    const limit = request.nextUrl.searchParams.get("limit") ?? "50";

    if (estado === "activo" && page === "1" && limit === "50") {
      const items = await fetchFaqsServer();
      return NextResponse.json({ items, total: items.length, page: 1, limit: 50 });
    }

    const { backendFetch } = await import("@/lib/backend/client");
    const searchParams = new URLSearchParams({ estado, page, limit });
    const data = await backendFetch(`/faq?${searchParams.toString()}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorFromUnknown(
      error,
      "No se pudieron cargar las preguntas frecuentes"
    );
  }
}
