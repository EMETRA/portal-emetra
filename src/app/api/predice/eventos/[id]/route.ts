import { NextRequest, NextResponse } from "next/server";
import { BackendError } from "@/lib/backend/client";
import { fetchPrediceEventByIdServer } from "@/lib/predice/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const admin = request.nextUrl.searchParams.get("admin") ?? undefined;
    const event = await fetchPrediceEventByIdServer(id, admin);

    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[GET /api/predice/eventos/[id]]", error);
    return NextResponse.json(
      { error: "No se pudo cargar el evento" },
      { status: 500 }
    );
  }
}
