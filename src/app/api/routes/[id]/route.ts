import { NextResponse } from "next/server";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";
import { fetchRouteByIdServer } from "@/lib/routes/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const route = await fetchRouteByIdServer(id);

    if (!route) {
      return apiErrorResponse("Ruta no encontrada", 404, "NOT_FOUND");
    }

    return NextResponse.json(route);
  } catch (error) {
    return apiErrorFromUnknown(error, "No se pudo cargar la ruta");
  }
}
