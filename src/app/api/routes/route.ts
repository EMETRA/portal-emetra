import { NextResponse } from "next/server";
import { apiErrorFromUnknown } from "@/lib/api/errors";
import { fetchRoutesServer } from "@/lib/routes/server";

export async function GET() {
  try {
    const items = await fetchRoutesServer();
    return NextResponse.json({ items });
  } catch (error) {
    return apiErrorFromUnknown(error, "No se pudieron cargar las rutas");
  }
}
