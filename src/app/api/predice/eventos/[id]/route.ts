import { NextRequest, NextResponse } from "next/server";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";
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
      return apiErrorResponse("Evento no encontrado", 404, "NOT_FOUND");
    }

    return NextResponse.json(event);
  } catch (error) {
    return apiErrorFromUnknown(error, "No se pudo cargar el evento");
  }
}
